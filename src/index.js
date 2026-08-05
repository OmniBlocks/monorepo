/**
 * OmniBlocks Boxy - Message Sanitization & Pipeline
 */

function sanitizeCodeRabbitPing(message) {
    if (!message) return message;
    
    // We want to detect:
    // 1. @CodeRabbit (case-insensitive or exact @CodeRabbit)
    // 2. C[]()o[]()de[]()Rabbit (with any possible variant/spacing/brackets or exact format)
    // And convert both to the correct `@coderabbitai` handle (formatted as a code block, e.g. `@coderabbitai`).
    // But we must preserve existing markdown and code blocks (inline or fenced).

    // Let's implement a robust parser/replacement that avoids touching code blocks.
    // Fenced code blocks: ```...``` or ~~~...~~~
    // Inline code blocks: `...`

    // Strategy: tokenize or split by code blocks (fenced and inline), then apply replacement on non-code parts.
    
    // Regex to match fenced code blocks or inline code blocks or regular text
    // Fenced: /```[\s\S]*?```/g
    // Inline: /`[^`]+`/g
    
    const parts = [];
    const regex = /(```[\s\S]*?```|`[^`]+`)/g;
    
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(message)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ text: message.substring(lastIndex, match.index), isCode: false });
        }
        parts.push({ text: match[0], isCode: true });
        lastIndex = regex.lastIndex;
    }
    
    if (lastIndex < message.length) {
        parts.push({ text: message.substring(lastIndex), isCode: false });
    }
    
    // Process non-code parts
    for (const part of parts) {
        if (!part.isCode) {
            // Replace @CodeRabbit (case-insensitive or exact) and C[]()o[]()de[]()Rabbit with `@coderabbitai`
            // Pattern for C[]()o[]()de[]()Rabbit (with optional brackets/parentheses inside)
            // e.g. C[]()o[]()de[]()Rabbit or C\s*\[\]\s*\(\)\s*o...
            
            // Let's replace obfuscated pattern: C(\s*\[[^\]]*\]\s*\([^)]*\))*o(\s*\[[^\]]*\]\s*\([^)]*\))*d(\s*\[[^\]]*\]\s*\([^)]*\))*e(\s*\[[^\]]*\]\s*\([^)]*\))*Rabbit/gi
            // Or simpler: handle C[]()o[]()de[]()Rabbit specifically and also @CodeRabbit
            
            let text = part.text;
            
            // 1. Obfuscated CodeRabbit: C[]()o[]()de[]()Rabbit (with brackets/parens between letters)
            const obfuscatedRegex = /C\s*(\[\s*\]\s*\(\s*\))\s*o\s*(\[\s*\]\s*\(\s*\))\s*d\s*(\[\s*\]\s*\(\s*\))\s*e\s*(\[\s*\]\s*\(\s*\))\s*Rabbit/gi;
            text = text.replace(obfuscatedRegex, '`@coderabbitai`');
            
            // 2. @CodeRabbit (case-insensitive or exact) -> `@coderabbitai`
            const mentionRegex = /@CodeRabbit\b/gi;
            text = text.replace(mentionRegex, '`@coderabbitai`');
            
            part.text = text;
        }
    }
    
    return parts.map(p => p.text).join('');
}

// Message-posting pipeline integration mock / function
async function postMessage(apiClient, target, message) {
    const sanitized = sanitizeCodeRabbitPing(message);
    if (target.type === 'comment') {
        return await apiClient.createComment(target.id, sanitized);
    } else if (target.type === 'issueComment') {
        return await apiClient.replyToIssueComment(target.id, sanitized);
    }
    return sanitized;
}

module.exports = {
    sanitizeCodeRabbitPing,
    postMessage
};
