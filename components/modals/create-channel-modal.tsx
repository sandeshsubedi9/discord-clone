"use client"

import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import qs from 'query-string'

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '../ui/dialog'

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'
import { ChannelType } from '@prisma/client'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'
import { SelectValue } from '@radix-ui/react-select'

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Channel name is required'
    }).refine(name => name !== 'general',
        {
            message: 'Channel name cannot be "general"'
        }),
    type: z.nativeEnum(ChannelType),

})

const CreateChannelModal = () => {
    const { isOpen, onClose, type ,data} = useModal()
    const router = useRouter()
    const params = useParams()

    const isModalOpen = isOpen && type === 'createChannel'
    const {channelType} = data

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: channelType || ChannelType.TEXT
        }
    })

    useEffect(() => {
        if(channelType){
            form.setValue('type',channelType)
        } else{
            form.setValue('type',ChannelType.TEXT)
        }
    },[channelType, form])

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: '/api/channels',
                query: {
                    serverId: params?.serverId
                }
            })
            await axios.post(url, values)
            form.reset()
            router.refresh()
            onClose()

        } catch (error) {
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
                        Create Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 px-6 '>
                            <FormField control={form.control} name='name' render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        htmlFor='name'
                                        className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
                                    >
                                        Channel Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isLoading}
                                            id='name'
                                            placeholder='Enter Channel name'
                                            className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 '
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField control={form.control} name='type' render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Channel Type
                                    </FormLabel>
                                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'>
                                                <SelectValue placeholder='Select a channel type' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className='capitalize'>
                                            {Object.values(ChannelType).map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type.toLowerCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
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

export default CreateChannelModal
