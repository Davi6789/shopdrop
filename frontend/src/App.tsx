import Home from './pages/Home';

function App() {
  return (
    <div className="min-h-screen bg-green-50">
      <nav className="bg-green-800 text-white px-6 py-4 shadow-md">
        <h1 className="text-xl font-bold">🌱 ShopDrop — Pflanzenshop</h1>
      </nav>
      <main>
        <Home />
      </main>
    </div>
  );
}

export default App;