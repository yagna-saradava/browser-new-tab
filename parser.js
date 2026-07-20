export const MdParser = {
	toHtml: function(mdText) {
		if(!mdText || typeof mdText !== "string") return "";

		const codeBlocks = [];
		let placeholderCounter = 0;

		// Robust multi-line code block replacement regex that catches optional backticks or mixed tags
		let processedText = mdText.replace(/```(\w*)\n([\s\S]*?)\n```/g, (match, lang, code) => {
			// Clean safe alphanumeric placeholder string with NO underscores that could be corrupted by escaping steps
			const placeholder = `CODEBLOCKPLACEHOLDER${placeholderCounter}`;
			
			const escapedCode = code
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;");

			const langLabel = lang ? `<div class="code-lang-label">${lang}</div>` : "";
			
			const codeHtml = `
				<div class="code-block-container" style="background-color: #1e1e1e; border-radius: 6px; margin: 15px 0; overflow: hidden; color: #d4d4d4; font-family: monospace; text-align: left;">
					<div class="code-block-header" style="background-color: #2d2d2d; padding: 6px 12px; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
						${langLabel}
						<button class="copy-code-btn" style="background-color: #444; color: #fff; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText).then(() => { this.innerText = 'Copied!'; setTimeout(() => this.innerText = 'Copy', 2000); })">Copy</button>
					</div>
					<pre style="margin: 0; padding: 12px; overflow-x: auto;"><code class="language-${lang}">${escapedCode}</code></pre>
				</div>
			`.trim();

			codeBlocks.push({ placeholder, html: codeHtml });
			placeholderCounter++;
			return placeholder;
		});

		// Escape global raw text strings
		processedText = processedText
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");

		// Parse blocks line by line
		const lines = processedText.split("\n");
		let outputLines = [];
		let inTable = false;
		let tableRows = [];

		for(let i = 0; i < lines.length; i++) {
			let line = lines[i].trim();

			if(/^(---|===\s*|\*\*\*|___)$/.test(line)) {
				if(inTable) {
					inTable = false;
					outputLines.push(this._renderTable(tableRows));
					tableRows = [];
				}
				outputLines.push("<hr>");
				continue;
			}

			const isTableRow = line.startsWith("|") && line.endsWith("|");
			if(isTableRow) {
				if(/^[|\s\-:]+$/.test(line)) continue;
				inTable = true;
				tableRows.push(line);
				continue;
			}
			else if(inTable) {
				inTable = false;
				outputLines.push(this._renderTable(tableRows));
				tableRows = [];
			}

			if(line.startsWith("#")) {
				const match = line.match(/^(#{1,6})\s+(.+)$/);
				if(match) {
					const level = match[1].length;
					outputLines.push(`<h${level}>${match[2]}</h${level}>`);
					continue;
				}
			}

			if(/^([*\-+])\s+(.+)$/.test(line)) {
				outputLines.push(`<li>${line.replace(/^([*\-+])\s+/, "")}</li>`);
				continue;
			}

			outputLines.push(lines[i]);
		}

		if(inTable) outputLines.push(this._renderTable(tableRows));
		let finalHtml = outputLines.join("\n");

		// Run inline inline styles
		finalHtml = finalHtml.replace(/(\*\*|__)(.*?)\1/g, "<b>$2</b>");
		finalHtml = finalHtml.replace(/(\*|_)(.*?)\1/g, "<i>$2</i>");
		finalHtml = finalHtml.replace(/~~(.*?)~~/g, "<del>$1</del>");
		finalHtml = finalHtml.replace(/`([^`\n]+)`/g, "<code>$1</code>");
		finalHtml = finalHtml.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

		// Exact string replacement configuration to inject saved markup
		codeBlocks.forEach(item => {
			finalHtml = finalHtml.split(item.placeholder).join(item.html);
		});

		// Fix remaining newlines outside containers into breaks
		finalHtml = finalHtml.split("\n").map(line => {
			if(line.trim() === "") return "<br>";
			if(/<\/?(h[1-6]|hr|div|pre|code|tr|td|th|table|thead|tbody|li)/i.test(line)) return line;
			return line + "<br>";
		}).join("\n");

		return finalHtml;
  	},

  	_renderTable: function(rows) {
    	if(rows.length === 0) return "";
    	let html = "<table>";
    	rows.forEach((row, index) => {
      		const cells = row.split("|").map(c => c.trim()).filter((c, i, a) => i > 0 && i < a.length - 1);
      		const cellTag = index === 0 ? "th" : "td";

      		if(index === 0) html += "<thead><tr>";
      		else if(index === 1) html += "<tbody><tr>";
      		else html += "<tr>";

      		cells.forEach(cell => {
				html += `<${cellTag}>${cell}</${cellTag}>`;
			});

      		html += "</tr>";
      		if(index === 0) html += "</thead>";
    	});
    	html += "</tbody></table>";
    	return html;
  	}
};