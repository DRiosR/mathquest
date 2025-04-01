export default function RegisterModal() {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-lg font-semibold">Verificando correo...</h2>
          <div className="spinner-border text-blue-500 mt-2" role="status">
            <span className="sr-only">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }
  