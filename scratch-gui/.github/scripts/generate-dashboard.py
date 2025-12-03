#!/usr/bin/env python3
import os
import sys
import html
import subprocess
from pathlib import Path
import re

def read_file_safe(filename):
    """Read file content safely, return default message if file doesn't exist."""
    try:
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
                return f.read()
    except Exception as e:
        print(f"Error reading {filename}: {e}", file=sys.stderr)
    return f"No {filename} available"

def get_platform_icon(platform_name):
    """Get emoji icon for platform."""
    if 'ubuntu' in platform_name or 'linux' in platform_name:
        return '🐧'
    elif 'windows' in platform_name:
        return '🪟'
    elif 'macos' in platform_name or 'mac' in platform_name:
        return '🍎'
    else:
        return '🖥️'

def get_platform_display_name(platform_name):
    """Convert platform directory name to display name."""
    # Remove 'screenshots-' prefix and '-chromium' suffix
    name = platform_name.replace('screenshots-', '')
    
    # Map platform names
    if 'ubuntu-latest' in name:
        return 'Ubuntu'
    elif 'windows-latest' in name:
        return 'Windows'
    elif 'macos-latest' in name:
        return 'macOS'
    else:
        # Fallback: capitalize and clean up
        return name.replace('-', ' ').title()

def generate_screenshot_html_for_platform(screenshots_dir, platform_name):
    """Generate HTML for screenshot cards from a specific platform."""
    if not os.path.exists(screenshots_dir):
        return '<p>No screenshots available for this platform</p>'
    
    screenshots_html = []
    screenshot_files = sorted(Path(screenshots_dir).glob('*.png'))
    
    if not screenshot_files:
        return '<p>No screenshots available for this platform</p>'
    
    for screenshot in screenshot_files:
        filename = screenshot.name
        # Convert filename to nice title (e.g., "stage-sprites.png" -> "Stage Sprites")
        name = filename.replace('-', ' ').replace('.png', '').title()
        
        # Relative path for HTML
        rel_path = f"{screenshots_dir}/{filename}"
        
        # Add note only for editor-initial (which is redundant with code-tab)
        note = ''
        if filename == 'editor-initial.png':
            note = '<div class="note">ℹ️ Note: Shows code tab (redundant with code-tab)</div>'
        
        screenshots_html.append(f'''
                <div class="screenshot-card">
                  <h3>{name}</h3>
                  <img src="{rel_path}" alt="{name}" data-platform="{platform_name}">
                  {note}
                </div>''')
    
    return ''.join(screenshots_html)

def generate_all_screenshots_html(output_dir):
    """Generate HTML for all platform screenshots organized by platform."""
    # Find all screenshot directories (pattern: screenshots-*)
    screenshot_dirs = []
    for entry in os.listdir(output_dir):
        if entry.startswith('screenshots-') and os.path.isdir(os.path.join(output_dir, entry)):
            screenshot_dirs.append(entry)
    
    # Also check for legacy single screenshots/ directory
    if os.path.exists(os.path.join(output_dir, 'screenshots')) and os.path.isdir(os.path.join(output_dir, 'screenshots')):
        screenshot_dirs.append('screenshots')
    
    if not screenshot_dirs:
        return '<p>No screenshots available</p>', ''
    
    # Sort directories
    screenshot_dirs.sort()
    
    # Generate tabs and content
    tabs_html = []
    content_html = []
    
    for idx, dir_name in enumerate(screenshot_dirs):
        platform_name = get_platform_display_name(dir_name)
        platform_icon = get_platform_icon(dir_name)
        tab_id = f"platform-{idx}"
        active_class = 'active' if idx == 0 else ''
        
        # Generate tab button
        tabs_html.append(f'''
          <button class="platform-tab {active_class}" onclick="showPlatform('{tab_id}')">{platform_icon} {platform_name}</button>''')
        
        # Generate tab content
        screenshots_html = generate_screenshot_html_for_platform(dir_name, platform_name)
        content_html.append(f'''
        <div id="{tab_id}" class="platform-content {active_class}">
          <h3 style="margin-bottom: 20px; color: #555;">{platform_icon} {platform_name} Screenshots</h3>
          <div class="screenshots-grid">{screenshots_html}</div>
        </div>''')
    
    tabs_section = ''.join(tabs_html)
    content_section = ''.join(content_html)
    
    return tabs_section, content_section

def generate_chaos_videos_html(video_dir, repo):
    """Generate HTML for chaos test videos."""
    if not video_dir or video_dir == 'None':
        return '<p>No chaos testing videos available for this run.</p>'
    
    # List of potential video files from chaos tests
    video_files = [
        ('chaos-test-chromium-video.webm', 'chaos-test-chromium-video.gif', '🌪️ Random Click Spam', 'chaos-test'),
        ('recorded-actions-chromium-video.webm', 'recorded-actions-chromium-video.gif', '🎬 Recorded Actions Playback', 'recorded-actions')
    ]
    
    videos_html = []
    for webm_filename, gif_filename, title, test_id in video_files:
        webm_url = f'https://github.com/{repo}/raw/chaos-videos/{video_dir}/{webm_filename}'
        gif_url = f'https://github.com/{repo}/raw/chaos-videos/{video_dir}/{gif_filename}'
        download_url = f'https://github.com/{repo}/blob/chaos-videos/{video_dir}/{webm_filename}?raw=true'
        
        videos_html.append(f'''
                <div class="video-card">
                  <h3>{title}</h3>
                  <div class="gif-wrapper">
                    <img src="{gif_url}" alt="{title}" style="width: 100%; border-radius: 8px;">
                  </div>
                  <div class="video-actions">
                    <a href="{download_url}" class="download-btn" download>⬇️ Download Video (WebM)</a>
                    <a href="https://github.com/{repo}/tree/chaos-videos/{video_dir}" class="browse-btn" target="_blank">📁 Browse All Files</a>
                  </div>
                </div>''')
    
    return ''.join(videos_html)

def generate_dashboard(output_dir):
    """Generate the HTML dashboard."""
    # Get commit SHA
    commit_sha = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'], text=True).strip()
    date = subprocess.check_output(['date', '-u', '+%Y-%m-%d %H:%M:%S UTC'], text=True).strip()
    
    # Get metadata from environment variables
    build_status_raw = os.environ.get('BUILD_STATUS', '')
    if build_status_raw == "success":
        build_status = "✅ Passed"
        build_status_class = "success"
        build_icon = "✅"
    else:
        build_status = "❌ Failed"
        build_status_class = "error"
        build_icon = "❌"
    
    # Lint status
    lint_status_raw = os.environ.get('LINT_STATUS', '')
    if lint_status_raw == "passed":
        lint_status = "✅ Passed"
        lint_status_class = "success"
        lint_icon = "✅"
        lint_result = "Passed"
    else:
        lint_status = "❌ Failed"
        lint_status_class = "error"
        lint_icon = "❌"
        lint_result = "Failed"
    
    # Unit test status
    unit_status_raw = os.environ.get('UNIT_STATUS', '')
    if unit_status_raw == "passed":
        unit_status = "✅ Passed"
        unit_status_class = "success"
        unit_icon = "✅"
    else:
        unit_status = "❌ Failed"
        unit_status_class = "error"
        unit_icon = "❌"
    
    # Integration test status
    integration_status_raw = os.environ.get('INTEGRATION_STATUS', '')
    if integration_status_raw == "passed":
        integration_status = "✅ Passed"
        integration_status_class = "success"
        integration_icon = "✅"
    else:
        integration_status = "❌ Failed"
        integration_status_class = "error"
        integration_icon = "❌"
    
    # Screenshot status
    screenshot_status_raw = os.environ.get('SCREENSHOT_STATUS', '')
    if screenshot_status_raw == "success":
        screenshot_status = "✅ Done"
        screenshot_status_class = "success"
        screenshot_icon = "📸"
    else:
        screenshot_status = "⚠️ Issues"
        screenshot_status_class = "warning"
        screenshot_icon = "⚠️"
    
    # Chaos testing status
    chaos_status_raw = os.environ.get('CHAOS_STATUS', '')
    chaos_errors = os.environ.get('CHAOS_ERRORS_FOUND', 'false')
    if chaos_status_raw == "passed":
        chaos_status = "✅ Clean"
        chaos_status_class = "success"
        chaos_icon = "🌪️"
    elif chaos_errors == "true":
        chaos_status = "❌ Errors"
        chaos_status_class = "error"
        chaos_icon = "🐛"
    else:
        chaos_status = "⚠️ N/A"
        chaos_status_class = "warning"
        chaos_icon = "⚠️"
    
    # Read log files
    install_log = read_file_safe('install-output.txt')
    build_log = read_file_safe('build-output.txt')
    lint_log = read_file_safe('lint-output.txt')
    unit_log = read_file_safe('unit-test-output.txt')
    integration_log = read_file_safe('integration-test-output.txt')
    screenshot_log = read_file_safe('screenshot-output.txt')
    chaos_log = read_file_safe('chaos-test-output.txt')
    recorded_log = read_file_safe('recorded-actions-output.txt')
    
    # Generate screenshot tabs and content
    screenshot_tabs, screenshot_content = generate_all_screenshots_html(output_dir)
    
    # Generate chaos videos HTML
    repo = os.environ.get('REPO', 'Unknown')
    video_dir = os.environ.get('VIDEO_DIR', None)
    chaos_videos_html = generate_chaos_videos_html(video_dir, repo)
    
    # Chaos section visibility
    chaos_section = ''
    if video_dir and video_dir != 'None':
        chaos_section = f'''
      <section>
        <h2>🌪️ Chaos Testing Videos</h2>
        <p style="margin-bottom: 20px; color: #666;">
          Watch recordings of chaos tests that detected console errors. These videos show the exact sequence of events that led to each error.
        </p>
        <div class="videos-grid">{chaos_videos_html}</div>
      </section>'''
    
    # Chaos logs tab
    chaos_logs_tabs = ''
    chaos_logs_content = ''
    if chaos_status_raw:
        chaos_logs_tabs = '''
          <button class="tab" onclick="showTab('chaos')">Chaos Test</button>
          <button class="tab" onclick="showTab('recorded')">Recorded Actions</button>'''
        chaos_logs_content = f'''
        <div id="chaos-tab" class="tab-content"><div class="log-viewer"><pre>{html.escape(chaos_log)}</pre></div></div>
        <div id="recorded-tab" class="tab-content"><div class="log-viewer"><pre>{html.escape(recorded_log)}</pre></div></div>'''
    
    # HTML template - NOTE: CSS/JS curly braces are escaped with {{ and }}
    html_template = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Main Branch Test Dashboard - OmniBlocks</title>
  <style>
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #333; line-height: 1.6; min-height: 100vh; padding: 20px; }}
    .container {{ max-width: 1400px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden; }}
    header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; }}
    header h1 {{ font-size: 2.5em; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }}
    header .meta {{ opacity: 0.9; font-size: 1.1em; }}
    .content {{ padding: 40px; }}
    .status-overview {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }}
    .status-card {{ background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 15px; padding: 25px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease; }}
    .status-card:hover {{ transform: translateY(-5px); }}
    .status-card.success {{ background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); }}
    .status-card.warning {{ background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); }}
    .status-card.error {{ background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); }}
    .status-card .icon {{ font-size: 3em; margin-bottom: 10px; }}
    .status-card .title {{ font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; margin-bottom: 5px; }}
    .status-card .value {{ font-size: 2em; font-weight: bold; }}
    section {{ margin-bottom: 40px; }}
    section h2 {{ font-size: 2em; margin-bottom: 20px; color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 10px; }}
    .test-results {{ display: grid; gap: 20px; }}
    .test-group {{ background: #f8f9fa; border-radius: 10px; padding: 20px; border-left: 5px solid #667eea; }}
    .test-group h3 {{ margin-bottom: 15px; color: #555; }}
    .test-stats {{ display: flex; gap: 20px; flex-wrap: wrap; }}
    .test-stat {{ flex: 1; min-width: 150px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }}
    .test-stat .label {{ font-size: 0.85em; color: #666; margin-bottom: 5px; }}
    .test-stat .value {{ font-size: 1.8em; font-weight: bold; color: #333; }}
    .platform-tabs {{ display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #e0e0e0; flex-wrap: wrap; }}
    .platform-tab {{ padding: 15px 30px; cursor: pointer; border: none; background: #f8f9fa; font-size: 1.1em; color: #666; border-radius: 10px 10px 0 0; transition: all 0.3s ease; font-weight: 500; }}
    .platform-tab:hover {{ background: #e9ecef; color: #667eea; }}
    .platform-tab.active {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: bold; }}
    .platform-content {{ display: none; }}
    .platform-content.active {{ display: block; }}
    .screenshots-grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 30px; }}
    .screenshot-card {{ background: #f8f9fa; border-radius: 10px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }}
    .screenshot-card h3 {{ margin-bottom: 15px; color: #555; }}
    .screenshot-card img {{ width: 100%; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.15); cursor: pointer; transition: transform 0.3s ease; }}
    .screenshot-card img:hover {{ transform: scale(1.02); }}
    .screenshot-card .note {{ margin-top: 10px; padding: 10px; background: #e7f3ff; border-left: 4px solid #2196F3; border-radius: 5px; font-size: 0.9em; color: #1565C0; }}
    .videos-grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(500px, 1fr)); gap: 30px; }}
    .video-card {{ background: #f8f9fa; border-radius: 10px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }}
    .video-card h3 {{ margin-bottom: 15px; color: #555; font-size: 1.3em; }}
    .gif-wrapper {{ position: relative; background: #000; border-radius: 8px; margin-bottom: 15px; overflow: hidden; }}
    .gif-wrapper img {{ display: block; width: 100%; height: auto; }}
    .video-actions {{ display: flex; gap: 10px; }}
    .download-btn, .browse-btn {{ flex: 1; padding: 12px; text-align: center; border-radius: 8px; text-decoration: none; font-weight: bold; transition: all 0.3s ease; }}
    .download-btn {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }}
    .download-btn:hover {{ transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }}
    .browse-btn {{ background: #f0f0f0; color: #333; }}
    .browse-btn:hover {{ background: #e0e0e0; }}
    .log-viewer {{ background: #1e1e1e; color: #d4d4d4; border-radius: 10px; padding: 20px; font-family: 'Monaco', 'Courier New', monospace; font-size: 0.9em; max-height: 500px; overflow-y: auto; line-height: 1.5; }}
    .log-viewer pre {{ white-space: pre-wrap; word-wrap: break-word; }}
    .tabs {{ display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #e0e0e0; flex-wrap: wrap; }}
    .tab {{ padding: 12px 24px; cursor: pointer; border: none; background: none; font-size: 1em; color: #666; border-bottom: 3px solid transparent; transition: all 0.3s ease; }}
    .tab:hover {{ color: #667eea; }}
    .tab.active {{ color: #667eea; border-bottom-color: #667eea; font-weight: bold; }}
    .tab-content {{ display: none; }}
    .tab-content.active {{ display: block; }}
    footer {{ background: #f8f9fa; padding: 30px; text-align: center; color: #666; border-top: 1px solid #e0e0e0; }}
    .modal {{ display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.9); }}
    .modal-content {{ margin: 2% auto; display: block; max-width: 90%; max-height: 90%; }}
    .close {{ position: absolute; top: 30px; right: 50px; color: #f1f1f1; font-size: 50px; font-weight: bold; cursor: pointer; }}
    .close:hover {{ color: #bbb; }}
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🚀 Main Branch Test Dashboard</h1>
      <div class="meta">
        <strong>Commit:</strong> {commit_sha}<br>
        <strong>Date:</strong> {date}<br>
        <strong>Duration:</strong> {duration}
      </div>
    </header>
    <div class="content">
      <div class="status-overview">
        <div class="status-card {build_status_class}">
          <div class="icon">{build_icon}</div>
          <div class="title">Build</div>
          <div class="value">{build_status}</div>
        </div>
        <div class="status-card {lint_status_class}">
          <div class="icon">{lint_icon}</div>
          <div class="title">Lint</div>
          <div class="value">{lint_status}</div>
        </div>
        <div class="status-card {unit_status_class}">
          <div class="icon">{unit_icon}</div>
          <div class="title">Unit Tests</div>
          <div class="value">{unit_status}</div>
        </div>
        <div class="status-card {integration_status_class}">
          <div class="icon">{integration_icon}</div>
          <div class="title">Integration</div>
          <div class="value">{integration_status}</div>
        </div>
        <div class="status-card {screenshot_status_class}">
          <div class="icon">{screenshot_icon}</div>
          <div class="title">Screenshots</div>
          <div class="value">{screenshot_status}</div>
        </div>
        <div class="status-card {chaos_status_class}">
          <div class="icon">{chaos_icon}</div>
          <div class="title">Chaos Tests</div>
          <div class="value">{chaos_status}</div>
        </div>
      </div>
      <section>
        <h2>📊 Test Results</h2>
        <div class="test-results">
          <div class="test-group">
            <h3>🔍 ESLint</h3>
            <div class="test-stats">
              <div class="test-stat"><div class="label">Status</div><div class="value">{lint_result}</div></div>
              <div class="test-stat"><div class="label">Errors</div><div class="value" style="color: #dc3545;">{lint_errors}</div></div>
              <div class="test-stat"><div class="label">Warnings</div><div class="value" style="color: #ffc107;">{lint_warnings}</div></div>
            </div>
          </div>
          <div class="test-group">
            <h3>🧪 Unit Tests</h3>
            <div class="test-stats">
              <div class="test-stat"><div class="label">Total</div><div class="value">{unit_total}</div></div>
              <div class="test-stat"><div class="label">Passed</div><div class="value" style="color: #28a745;">{unit_passed}</div></div>
              <div class="test-stat"><div class="label">Failed</div><div class="value" style="color: #dc3545;">{unit_failed}</div></div>
              <div class="test-stat"><div class="label">Skipped</div><div class="value" style="color: #6c757d;">{unit_skipped}</div></div>
            </div>
          </div>
          <div class="test-group">
            <h3>🔗 Integration Tests</h3>
            <div class="test-stats">
              <div class="test-stat"><div class="label">Total</div><div class="value">{integration_total}</div></div>
              <div class="test-stat"><div class="label">Passed</div><div class="value" style="color: #28a745;">{integration_passed}</div></div>
              <div class="test-stat"><div class="label">Failed</div><div class="value" style="color: #dc3545;">{integration_failed}</div></div>
              <div class="test-stat"><div class="label">Skipped</div><div class="value" style="color: #6c757d;">{integration_skipped}</div></div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <h2>📸 Multi-Platform Screenshots</h2>
        <p style="margin-bottom: 20px; color: #666;">Screenshots captured across Ubuntu, Windows, and macOS platforms with Chromium browser.</p>
        <div class="platform-tabs">{screenshot_tabs}</div>
        {screenshot_content}
      </section>{chaos_section}
      <section>
        <h2>📝 Logs</h2>
        <div class="tabs">
          <button class="tab active" onclick="showTab('install')">Install</button>
          <button class="tab" onclick="showTab('build')">Build</button>
          <button class="tab" onclick="showTab('lint')">Lint</button>
          <button class="tab" onclick="showTab('unit')">Unit Tests</button>
          <button class="tab" onclick="showTab('integration')">Integration Tests</button>
          <button class="tab" onclick="showTab('screenshots')">Screenshots</button>{chaos_logs_tabs}
        </div>
        <div id="install-tab" class="tab-content active"><div class="log-viewer"><pre>{install_log}</pre></div></div>
        <div id="build-tab" class="tab-content"><div class="log-viewer"><pre>{build_log}</pre></div></div>
        <div id="lint-tab" class="tab-content"><div class="log-viewer"><pre>{lint_log}</pre></div></div>
        <div id="unit-tab" class="tab-content"><div class="log-viewer"><pre>{unit_log}</pre></div></div>
        <div id="integration-tab" class="tab-content"><div class="log-viewer"><pre>{integration_log}</pre></div></div>
        <div id="screenshots-tab" class="tab-content"><div class="log-viewer"><pre>{screenshot_log}</pre></div></div>{chaos_logs_content}
      </section>
    </div>
    <footer>
      <p><strong>OmniBlocks Main Branch Testing</strong></p>
      <p>Generated automatically by GitHub Actions</p>
      <p><a href="https://github.com/{repo}/actions/runs/{run_id}" style="color: #667eea;">View Workflow Run</a></p>
    </footer>
  </div>
  <div id="imageModal" class="modal" onclick="this.style.display='none'">
    <span class="close">&times;</span>
    <img class="modal-content" id="modalImage">
  </div>
  <script>
    function showTab(tabName) {{{{
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
      document.getElementById(tabName + '-tab').classList.add('active');
      event.target.classList.add('active');
    }}}}
    
    function showPlatform(platformId) {{{{
      document.querySelectorAll('.platform-content').forEach(content => content.classList.remove('active'));
      document.querySelectorAll('.platform-tab').forEach(tab => tab.classList.remove('active'));
      document.getElementById(platformId).classList.add('active');
      event.target.classList.add('active');
    }}}}
    
    document.querySelectorAll('.screenshot-card img').forEach(img => {{{{
      img.onclick = function() {{{{
        document.getElementById('imageModal').style.display = 'block';
        document.getElementById('modalImage').src = this.src;
      }}}};
    }}}});
  </script>
</body>
</html>'''
    
    # Fill template with values
    filled_template = html_template.format(
        commit_sha=html.escape(commit_sha),
        date=html.escape(date),
        duration=html.escape(os.environ.get('DURATION', 'Unknown')),
        build_status_class=build_status_class,
        build_icon=build_icon,
        build_status=build_status,
        lint_status_class=lint_status_class,
        lint_icon=lint_icon,
        lint_status=lint_status,
        lint_result=lint_result,
        lint_errors=os.environ.get('LINT_ERRORS', '0'),
        lint_warnings=os.environ.get('LINT_WARNINGS', '0'),
        unit_status_class=unit_status_class,
        unit_icon=unit_icon,
        unit_status=unit_status,
        unit_total=os.environ.get('UNIT_TOTAL', '0'),
        unit_passed=os.environ.get('UNIT_PASSED', '0'),
        unit_failed=os.environ.get('UNIT_FAILED', '0'),
        unit_skipped=os.environ.get('UNIT_SKIPPED', '0'),
        integration_status_class=integration_status_class,
        integration_icon=integration_icon,
        integration_status=integration_status,
        integration_total=os.environ.get('INTEGRATION_TOTAL', '0'),
        integration_passed=os.environ.get('INTEGRATION_PASSED', '0'),
        integration_failed=os.environ.get('INTEGRATION_FAILED', '0'),
        integration_skipped=os.environ.get('INTEGRATION_SKIPPED', '0'),
        screenshot_status_class=screenshot_status_class,
        screenshot_icon=screenshot_icon,
        screenshot_status=screenshot_status,
        chaos_status_class=chaos_status_class,
        chaos_icon=chaos_icon,
        chaos_status=chaos_status,
        screenshot_tabs=screenshot_tabs,
        screenshot_content=screenshot_content,
        chaos_section=chaos_section,
        chaos_logs_tabs=chaos_logs_tabs,
        chaos_logs_content=chaos_logs_content,
        install_log=html.escape(install_log),
        build_log=html.escape(build_log),
        lint_log=html.escape(lint_log),
        unit_log=html.escape(unit_log),
        integration_log=html.escape(integration_log),
        screenshot_log=html.escape(screenshot_log),
        repo=os.environ.get('REPO', 'Unknown'),
        run_id=os.environ.get('RUN_ID', 'Unknown')
    )
    
    # Write the dashboard
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, 'index.html')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(filled_template)
    
    print(f"✅ Dashboard generated successfully at {output_file}")
    print(f"📸 Found screenshot directories: {', '.join(os.listdir(output_dir)) if os.path.exists(output_dir) else 'none'}")

if __name__ == '__main__':
    output_dir = sys.argv[1] if len(sys.argv) > 1 else 'dashboard'
    generate_dashboard(output_dir)