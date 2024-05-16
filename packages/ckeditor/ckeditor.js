import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { Bold } from '@ckeditor/ckeditor5-basic-styles';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Font } from '@ckeditor/ckeditor5-font';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { IndentBlock } from '@ckeditor/ckeditor5-indent';
import { Italic } from '@ckeditor/ckeditor5-basic-styles';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import { Strikethrough } from '@ckeditor/ckeditor5-basic-styles';
import { FileRepository } from '@ckeditor/ckeditor5-upload';
import {
    Image,
    ImageUpload,
    ImageResize,
} from '@ckeditor/ckeditor5-image';


export default class ClassicEditor extends ClassicEditorBase {

}

ClassicEditor.builtinPlugins = [
    ImageUpload,
    Alignment,
    Autoformat,
    BlockQuote,
    Bold,
    Essentials,
    Font,
    Heading,
    Image,
    ImageResize,
    Indent,
    IndentBlock,
    Italic,
    Link,
    List,
    Paragraph,
    RemoveFormat,
    SourceEditing,
    Strikethrough,
    FileRepository,
];

ClassicEditor.defaultConfig = {
    toolbar: {
        items: [
            'heading',
            '|',
            'fontSize',
            'fontFamily',
            'fontColor',
            'fontBackgroundColor',
            'bold',
            'italic',
            'strikethrough',
            'removeFormat',
            '|',
            'alignment',
            'outdent',
            'indent',
            '|',
            'link',
            'bulletedList',
            'numberedList',
            'blockQuote',
            '|',
            'sourceEditing',
        ],
    },
};
