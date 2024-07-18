import React,{memo} from 'react';
import {Editor} from '@tinymce/tinymce-react'
import {Controller} from 'react-hook-form'
import conf from '../../conf/conf';

export default memo(function RTE({name,control,defaultValue=""}) {
  return (
    <div className='w-full px-3 sm:px-10 md:px-16'>

        <Controller
        name={name || 'content'}
        control={control}
        render={({field:{onChange}})=>(
            <Editor
            
            initialValue={defaultValue}
            apiKey={conf.tinyMCEApiKey}
            init={{
                initialValue: defaultValue,
                height: 600,
                menubar: true,
                plugins: [
                    "image",
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                    "anchor",
                ],
                toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
            
            }}
            onEditorChange={onChange}
            
            />
        )}
        />
    </div>
  )
})