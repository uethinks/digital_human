import Image from "next/image";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Virtual Avatar Creator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a href="/avatars/create" className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">创建 Avatar</h2>
          <p className="text-gray-600">上传照片或选择模板创建个性化虚拟形象</p>
        </a>
        
        <a href="/avatars" className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">管理 Avatar</h2>
          <p className="text-gray-600">查看和管理已创建的虚拟形象</p>
        </a>
        
        <a href="/videos" className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">我的视频</h2>
          <p className="text-gray-600">使用 Avatar 生成个性化视频内容</p>
        </a>
      </div>
    </main>
  );
}
