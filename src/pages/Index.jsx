import BillSplitter from '../components/BillSplitter';
import HitCounter from '../components/HitCounter';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920&h=1080&fit=crop')` }}>
      <div className="relative z-10 w-full max-w-md p-6 backdrop-blur-lg bg-white/30 rounded-lg shadow-xl">
        <BillSplitter />
      </div>
      <div className="mt-4 text-white text-sm font-semibold z-10">
        Like this? <a href="https://buymeacoffee.com/justinyu" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-300 transition-colors">Donate</a>
      </div>
      <HitCounter />
    </div>
  );
};

export default Index;
