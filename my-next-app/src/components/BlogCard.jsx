import { useState } from 'react';

//card imports
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from './ui/button';

import Link from 'next/link';

//alert dialog imports
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
import { LoaderCircle } from 'lucide-react';

export default function BlogCard(props) {
	const { id, title, description } = props;
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
			console.log(msg);
			setLoader(false);
			window.location.reload();
			toast({ description: 'Post deleted successfully' });
		} catch (err) {
			console.log(err.message);
			setLoader(false);
			toast({
				title: 'Something went wrong!',
				description: 'Unable to delete post',
			});
			router.push('/');
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-lg'>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<p>
					{description?.length > 100
						? description?.slice(0, 100) + '...'
						: description}
				</p>
			</CardContent>
			<CardFooter>
				<div className='w-full flex justify-between'>
					<div>
						<Link href={`/view-post/${id}`}>
							<Button variant='outline'>Read More</Button>
						</Link>
					</div>
					<div className=''>
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
											  )} Deleting...`
											: 'Delete'}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
