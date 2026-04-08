module.exports = async ({github, context, core}) => {
  const fs = require('fs');
  const sha = context.sha.substring(0, 7);
  const timestamp = new Date().toISOString();
  const duration = process.env.DURATION;
  
  // Determine what failed
  const failedSteps = [];
  if (process.env.INSTALL_STATUS === 'failure') {
    failedSteps.push('dependency installation');
  }
  if (process.env.BUILD_STATUS === 'failure') {
    failedSteps.push('build');
  }
  if (process.env.LINT_STATUS === 'failed') {
    failedSteps.push('linting');
  }
  if (process.env.UNIT_STATUS === 'failed') {
    failedSteps.push('unit tests');
  }
  if (process.env.INTEGRATION_STATUS === 'failed') {
    failedSteps.push('integration tests');
  }
  
  const failedStep = failedSteps.join(', ') || 'unknown step';
  
  // Get error logs (truncated to avoid size issues)
  let errorOutput = '';
  try {
    if (fs.existsSync('install-output.txt')) {
      errorOutput += '### Install Output\n```\n' + fs.readFileSync('install-output.txt', 'utf8').slice(-1500) + '\n```\n\n';
    }
    if (fs.existsSync('build-output.txt')) {
      errorOutput += '### Build Output\n```\n' + fs.readFileSync('build-output.txt', 'utf8').slice(-1500) + '\n```\n\n';
    }
    if (fs.existsSync('lint-output.txt')) {
      errorOutput += '### Lint Output\n```\n' + fs.readFileSync('lint-output.txt', 'utf8').slice(-1500) + '\n```\n\n';
    }
    if (fs.existsSync('unit-test-output.txt')) {
      errorOutput += '### Unit Test Output\n```\n' + fs.readFileSync('unit-test-output.txt', 'utf8').slice(-1500) + '\n```\n\n';
    }
    if (fs.existsSync('integration-test-output.txt')) {
      errorOutput += '### Integration Test Output\n```\n' + fs.readFileSync('integration-test-output.txt', 'utf8').slice(-1500) + '\n```\n\n';
    }
  } catch (e) {
    errorOutput = 'Error reading log files: ' + e.message;
  }
  
  // Check for existing open issues
  const { data: issues } = await github.rest.issues.listForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: 'open',
    labels: 'build-failure'
  });
  
  const existingIssue = issues.find(issue => 
    issue.title.includes('Main Branch Build/Test Failure')
  );
  
  const baseUrl = `https://${context.repo.owner}.github.io/${context.repo.repo}`;
  const dashboardUrl = `${baseUrl}/tests/latest/`;
  
  const title = `Main Branch Build/Test Failure - ${timestamp}`;
  const body = `## 🚨 Main Branch Build/Test Failure

The latest commit (\`${sha}\`) failed during **${failedStep}**.

### 📊 Details
- **Commit:** ${context.sha}
- **Time:** ${timestamp}
- **Duration:** ${duration}
- **Failed Steps:** ${failedStep}

### 📈 Dashboard
View the full test dashboard: ${dashboardUrl}

### 📝 Error Output (Last 1500 chars per log)
${errorOutput}

### 🔗 Links
- [Workflow Run](${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId})
- [Full Dashboard](${dashboardUrl})
- [Commit](${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/commit/${context.sha})`;
  
  if (!existingIssue) {
    await github.rest.issues.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      title: title,
      body: body,
      labels: ['build-failure', 'bug'],
      assignees: ['supervoidcoder']
    });
    console.log('Created new failure issue');
  } else {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: existingIssue.number,
      body: `## 🔄 Another Failure Detected

Commit \`${sha}\` also failed during **${failedStep}**.

${body}`
    });
    console.log('Added comment to existing failure issue');
  }
};
