import { Plugin, Editor, MarkdownView } from 'obsidian';

// Define the main class for the New Paragraph Plugin, extending Obsidian's Plugin class.
export default class NewParagraphPlugin extends Plugin {

    /**
     * This method is called when the plugin is loaded.
     */
    async onload() {
        // Register a DOM event listener for the 'Enter' key in the capture phase (true)
        // This allows us to intercept the key before Obsidian's default handler.
        this.registerDomEvent(document, 'keydown', (evt: KeyboardEvent) => {
            // Only trigger on Enter with no modifiers
            if (evt.key === 'Enter' && !evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey) {
                const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);

                // Only act if we have a markdown view and the editor has focus
                if (activeView && activeView.editor.hasFocus()) {
                    const editor = activeView.editor;
                    const cursor = editor.getCursor();
                    const line = editor.getLine(cursor.line);

                    /**
                     * listOrSpecialRegex matches:
                     * 1. Standard lists: -, *, +, 1.
                     * 2. Task lists: - [ ], - [x]
                     * 3. Blockquotes: >
                     * 4. Tables: |
                     * 5. Code block markers: ```, ~~~
                     */
                    const listOrSpecialRegex = /^(\s*)([-*+]|\d+\.|>|\||```|~~~|[-*+]\s?\[[ xX]\])(\s|$)/;

                    // If we are NOT in a list or special context, proceed with double newline
                    if (!listOrSpecialRegex.test(line)) {
                        evt.preventDefault();    // Stop Obsidian from inserting its own newline
                        evt.stopPropagation();   // Stop the event from bubbling up further
                        this.insertDoubleNewline(editor);
                    }
                }
            }
        }, true); // The 'true' here enables capture phase
    }

    /**
     * Insert two newlines at the current cursor position
     */
    private insertDoubleNewline(editor: Editor) {
        // replaceSelection handles both replacing selected text and moving the cursor automatically
        editor.replaceSelection('\n\n');
    }
}
