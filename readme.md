# General

If you include https://cdn.ckeditor.com/ckeditor5/31.0.0/classic/ckeditor.js locally it won't work. You will get this error:

```
Uncaught ReferenceError: ClassicEditor is not defined
```

Presumably it is expecting other files to be present at that location.

You have to build your own version to use it locally. Luckily they offer a really cool online building tool: https://ckeditor.com/ckeditor-5/online-builder/
Here you can pick and choose the interface, the modules you want, the layout of the toolbar etc.

# Images

For image upload there are a lot of options, the simplest is [base64 embedded](https://ckeditor.com/docs/ckeditor5/latest/features/image-upload/base64-upload-adapter.html).
Advantage of this is we don't need a dedicated endpoint because it's all inside the text.

Downside is the size of the resulting HTML, the images can't be optimized (e.g. fetch once, client cached), it is detremental in loading speed (the html to load is a lot bigger) which may in turn be negative for search engines.

An alternative is the [simple file uploader](https://ckeditor.com/docs/ckeditor5/latest/features/image-upload/simple-upload-adapter.html).

This should be trivial to plug into the node system and use attachments. The massive downside is that it puts hard requirements on the circumstances of using the rich text editor.
With base64, you can use it anywhere, for anything.

With the simple file uploader, you need to make sure the node attachments are added as component, you need to make sure you are working on a node (staged or realized) etc etc.

Currently the use-anywhere is winning from the performance considerations, especially because large images (hero's etc) should perhaps not be part of the article itself.


Currently picked plugins: 

Autoformat
Block quote
Bold
Link
Image
Cloud Services
Heading
Image caption
Image style
Image toolbar
Image upload
Indent
Italic
List
Media embed
Paste from Office
Table
Table toolbar
Text transformation
Alignment
Auto image
Autolink
Code blocks
Find and replace
Font family
Font color
Font background color
Font size
Image resize
Indent block
Source editing
Underline
Autosave
Code
Base64 upload adapter
Image insert
Link image
List style
Table caption
Media embed toolbar
HTML embed