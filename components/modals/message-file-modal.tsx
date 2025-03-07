"use client"

import { useForm } from 'react-hook-form'
import * as z from 'zod'
import qs from 'query-string'
import { zodResolver} from '@hookform/resolvers/zod'
import  axios  from 'axios'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader, 
    DialogTitle
} from '../ui/dialog'

import { Form , FormField, FormItem, FormControl, } from '../ui/form'
import { Button } from '../ui/button'
import React from 'react'
import FileUpload from '../file-upload'
import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'

const formSchema = z.object({
    fileUrl:z.string().min(1, {
        message: 'Attachment is required'
    })
})

const MessageFileModal = () => {
    const {isOpen, onClose, type, data} = useModal()
    const router = useRouter()

    const isModalOpen = isOpen && type === 'messageFile'
    const {apiUrl, query} = data

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: ''
        }
    })

    const isLoading = form.formState.isSubmitting

    const handleClose = () => {
        form.reset()
        onClose()
    }

    const onSubmit = async (values:z.infer<typeof formSchema>) => {
        try{
            const url = qs.stringifyUrl({
                url: apiUrl || '',
                query
            })

            await axios.post(url, {
                ...values,
                content:values.fileUrl
            })
            form.reset()
            router.refresh()
            handleClose()

        } catch(error){
            console.log(error)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose} >
            <DialogContent className='bg-white text-black p-0 overflow-hidden' >
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Add you Attachment
                    </DialogTitle>
                    <DialogDescription className='text-center text-gray-500'>
                        Send a file as Message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 px-6 '>
                            <div className='flex items-center justify-center text-center'>
                                <FormField control={form.control} name='fileUrl' render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload
                                            endpoint='messageFile'
                                            value={field.value}
                                            onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}/> 
                            </div>
                        </div>
                        <DialogFooter className='px-6 py-4 bg-green-100'>
                            <Button variant='primary' disabled={isLoading}>
                                Send
                            </Button>
                        </DialogFooter>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default MessageFileModal 
