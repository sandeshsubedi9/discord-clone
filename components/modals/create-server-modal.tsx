"use client"

import { useForm } from 'react-hook-form'
import * as z from 'zod'
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

import { Form , FormField, FormItem, FormLabel, FormControl, FormMessage} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import React from 'react'
import FileUpload from '../file-upload'
import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'

const formSchema = z.object({
    name: z.string().min(1,{
        message: 'Server name is required'
    }),
    imageUrl:z.string().min(1, {
        message: 'Server image is required'
    })
})

const CreateServerModal = () => {
    const {isOpen, onClose, type } = useModal()
    const router = useRouter()

    const isModalOpen = isOpen && type === 'createServer'

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imageUrl: ''
        }
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values:z.infer<typeof formSchema>) => {
        try{
            await axios.post('/api/servers', values)
            form.reset()
            router.refresh()
            onClose()

        } catch(error){
            console.log(error)
        }
    }

    const handleClose = () => {
        form.reset()
        onClose()
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden' >
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Customize your server
                    </DialogTitle>
                    <DialogDescription className='text-center text-gray-500'>
                        Give your server a prersonality by adding a name and an name and image. You can always change it later
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 px-6 '>
                            <div className='flex items-center justify-center text-center'>
                                <FormField control={form.control} name='imageUrl' render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload
                                            endpoint='serverImage'
                                            value={field.value}
                                            onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}/> 
                            </div>

                            <FormField control={form.control} name='name' render={({field}) => (
                                <FormItem>
                                    <FormLabel
                                     htmlFor='name'
                                     className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70' 
                                     >
                                        Server Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                        {...field}
                                        disabled={isLoading}
                                        id='name'
                                        placeholder='Enter server name'
                                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 '
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <DialogFooter className='px-6 py-4 bg-green-100'>
                            <Button variant='primary' disabled={isLoading}>
                                Create
                            </Button>
                        </DialogFooter>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateServerModal 
