'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';

//alert dialog
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function ViewPost({ params }) {
	const { id } = params;

	const [post, setPost] = useState({});
	const [loader, setLoader] = useState(false);

	const router = useRouter();
	const { toast } = useToast();

	async function deletePost(id) {
		try {
			setLoader(true);
			const res = await fetch(`http://localhost:8080/posts/${id}`, {
				method: 'DELETE',
			});
			const msg = await res.json();
			setLoader(false);
			toast({ description: 'Post deleted successfully' });
			router.push('/');
		} catch (err) {
			setLoader(false);
			toast({
				title: 'Something went wrong!',
				description: 'Post deleted successfully',
			});
			router.push('/');
		}
	}

	useEffect(() => {
		setLoader(true);
		async function getPost() {
			const res = await fetch(`http://localhost:8080/posts/${id}`);
			const data = await res.json();
			setPost(data);
			setLoader(false);
		}
		getPost();
	}, []);

	if (loader) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<LoaderCircle className='h-8 w-8 animate-spin' />
			</div>
		);
	}

	return (
		<div className='mt-10 mb-5'>
			<h2 className='text-xl font-semibold'>Details of Post</h2>
			<h1 className='text-2xl font-semibold my-5'>{post?.title}</h1>
			<p className='text-lg'>{post?.description}</p>
			<div className='flex mt-10'>
				<Link href='/'>
					<Button variant='outline'>Back</Button>
				</Link>
				<div className='flex gap-5 ml-auto'>
					<Link href={`/edit-post/${id}`}>
						<Button>Edit</Button>
					</Link>
					<div>
						<AlertDialog>
							<AlertDialogTrigger>
								<Button variant='destructive'>Delete</Button>
							</AlertDialogTrigger>
							<AlertDialogContent className='bg-white'>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Are you absolutely sure?
									</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will
										permanently delete your post and remove your data
										from our servers.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										variant='destructive'
										disabled={loader ? true : false}
										onClick={() => deletePost(id)}
									>
										{loader
											? `${(
													<LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
											  )} Progress...`
											: 'Delete'}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
			</div>
		</div>
	);
}
