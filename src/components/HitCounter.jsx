const HitCounter = () => {
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm">
      👀 Visitors: {Math.floor(Math.random() * 1000) + 100}
    </div>
  );
};

export default HitCounter;