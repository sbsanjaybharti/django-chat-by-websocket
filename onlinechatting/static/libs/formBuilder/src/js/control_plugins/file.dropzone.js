// configure the class for runtime loading
if (!window.fbControls) window.fbControls = [];

window.fbControls.push(function (controlClass, allControlClasses) {

   let controlText = allControlClasses.text;

   class controlDropzone extends controlClass {

   static get definition() {
      return {
        i18n: {
          default: 'Dropzone'
        }
     };
   }

  configure() {}

  build() {

      let innerWrapper = '<div class="dz-default dz-message"><span><i class="fa fa-paperclip" aria-hidden="true"></i>Drag and drop files or click to upload</span></div>';

      this.wrapper = this.markup('input', innerWrapper, { id: 'my-cool-dropzone', class: 'dropzone' });
      return [this.wrapper];
 }

 onRender(evt) {
          $("div#my-cool-dropzone").dropzone({ url: "/file/post" });
 }
}

  controlText.register('file', controlText, 'file');
  controlText.register('dropzone', controlDropzone, 'file');
   return controlDropzone;
});