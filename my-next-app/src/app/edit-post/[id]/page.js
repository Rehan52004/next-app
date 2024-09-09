'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

//form imports
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';

export default function EditPost({ params }) {
	const { id } = params;
	const [loader, setLoader] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	const formSchema = z.object({
		title: z.string().min(1, {
			message: 'Title is required field.',
		}),
		description: z.string().min(1, {
			message: 'Description is required field',
		}),
	});

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
		},
	});

	async function onSubmit(values) {
		try {
			setLoader(true);
			const res = await fetch(`http://localhost:8080/posts/${id}`, {
				method: 'PATCH',
				body: JSON.stringify({
					title: values.title,
					description: values.description,
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			});
			setLoader(false);
			toast({ description: 'Post updated successfully' });
			router.push('/');
		} catch (err) {
			setLoader(false);
			toast({
				title: 'Something went wrong!',
				description: 'Unable to update post',
			});
			router.push('/');
		}
	}

	useEffect(() => {
		async function editPost() {
			const res = await fetch(`http://localhost:8080/posts/${id}`);
			const data = await res.json();
			form.reset({
				title: data.title,
				description: data.description,
			});
		}
		editPost();
	}, [id, form]);

	return (
		<div className='mt-10'>
			<h3 className='text-2xl font-semibold mb-5'>Edit Post</h3>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
					<FormField
						control={form.control}
						name='title'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input placeholder='shadcn' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='description'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										placeholder='Write your description here'
										rows='5'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='flex gap-5'>
						<Link href={`/view-post/${id}`}>
							<Button variant='outline'>Cancel</Button>
						</Link>
						<Button type='submit' disabled={loader ? true : false}>
							{loader
								? `${(
										<LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
								  )} Progress...`
								: 'Confirm'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
