import { Layers3 } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
	return (
		<div className='flex items-center justify-between'>
			<div>
				<Layers3 className='h-6 w-6 font-semibold' />
			</div>
			<div className='flex gap-5'>
				<p>
					<Link href='/'>Home</Link>
				</p>
				<p>
					<Link href='/create-post'>Create Post</Link>
				</p>
			</div>
		</div>
	);
}
