import Link from 'next/link';


export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Virtual Avatar Creator</h1>
      
      <Link 
        href="/avatars/create"
        className="text-blue-500 hover:text-blue-600"
      >
        创建数字人
      </Link>

      <Link 
        href="/avatars"
        className="text-blue-500 hover:text-blue-600"
      >
        我的数字人
      </Link>

      <Link 
        href="/videos"
        className="text-blue-500 hover:text-blue-600"
      >
        我的视频
      </Link>
    </main>
  );
}
