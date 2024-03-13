import dynamic from 'next/dynamic';

const MainEditor = dynamic(() => import('../../components/Editor/editor/mainEditor'), {
  ssr: false,
});

export default function EditorPage() {
  return <MainEditor />;
}