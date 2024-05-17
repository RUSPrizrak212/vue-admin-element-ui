import '@thundev/vue-admin-ckeditor/build/ckeditor';
import '@thundev/vue-admin-ckeditor/build/translations/es';
import '@thundev/vue-admin-ckeditor/build/translations/fr';
import '@thundev/vue-admin-ckeditor/build/translations/ru';

import CKEditor from '@ckeditor/ckeditor5-vue';

/* eslint-disable no-undef, @typescript-eslint/ban-ts-comment */
// @ts-ignore
const CKEClassicEditor = ClassicEditor;

const CKEditorComponent = CKEditor.component;

export { CKEClassicEditor, CKEditorComponent };
