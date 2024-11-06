import React from 'react'
import ReactQuill, { Quill } from 'react-quill'
import ImageResize from 'quill-image-resize-module-react';

const Editor = ({value, onChange}) => {
    Quill.register('modules/imageResize', ImageResize);
    const modulos = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered'},
                { list: 'bullet'},
                { indent: '-1'},
                { indent: '+1'}
            ],
            ['link', 'image'],
            ['clean'],
        ], 
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize']
        }   
    };

return (
    <ReactQuill 
        value={value}
        onChange={onChange}
        modules={modulos}
    />
)
}

export default Editor