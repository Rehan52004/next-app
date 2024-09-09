'use client';

import { useEffect, useState } from 'react';
import BlogCard from '@/components/BlogCard';
import { Button } from '@/components/ui/button';

import Link from 'next/link';
import { LoaderCircle } from 'lucide-react';

export default function Home() {
	const [posts, setPosts] = useState([]);
	const [loader, setLoader] = useState(false);

	useEffect(() => {
		async function getAllPosts() {
			setLoader(true);
			const res = await fetch('http://localhost:8080/posts');
			const data = await res.json();
			setPosts(data);
			setLoader(false);
		}
		getAllPosts();
	}, []);

	if (loader) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<LoaderCircle className='h-8 w-8 animate-spin' />
			</div>
		);
	}

	//if databse have no posts
	if (posts.length === 0) {
		return (
			<div className='text-center mt-16'>
				<p className='mb-5'>No Posts in the databse</p>
				<Link href='/create-post'>
					<Button>Create your first post</Button>
				</Link>
			</div>
		);
	}

	return (
		<main className='my-5'>
			<h2 className='text-2xl font-semibold pt-5 pb-2'>All Posts</h2>
			<div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10'>
				{posts?.map((post) => (
					<div key={post.id}>
						<BlogCard
							id={post.id}
							title={post.title}
							description={post.description}
						/>
					</div>
				))}
			</div>
		</main>
	);
}
