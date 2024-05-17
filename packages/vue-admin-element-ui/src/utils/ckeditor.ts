import 'vue-admin-element-ui-ckeditor/build/ckeditor';
import 'vue-admin-element-ui-ckeditor/build/translations/es';
import 'vue-admin-element-ui-ckeditor/build/translations/fr';
import 'vue-admin-element-ui-ckeditor/build/translations/ru';

import CKEditor from '@ckeditor/ckeditor5-vue';

/* eslint-disable no-undef, @typescript-eslint/ban-ts-comment */
// @ts-ignore
const CKEClassicEditor = ClassicEditor;

const CKEditorComponent = CKEditor.component;

export { CKEClassicEditor, CKEditorComponent };
