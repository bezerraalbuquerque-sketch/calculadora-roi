export default function Footer() {
  return (
    <footer className="mt-12 py-8 border-t border-gray-100 text-center text-xs text-gray-400 space-y-2">
      <p>© 2026 RevTrack. Todos os direitos reservados.</p>
      <p>
        <a
          href="https://revtrack.com.br/termos-de-uso/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 transition-colors mx-2"
        >
          Termos de Uso
        </a>
        ·
        <a
          href="https://revtrack.com.br/politica-de-privacidade/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600 transition-colors mx-2"
        >
          Política de Privacidade
        </a>
      </p>
      <p className="text-gray-300">
        Os valores apresentados são estimativas baseadas nos dados inseridos e em médias de mercado. Não constituem garantia de resultado.
      </p>
    </footer>
  );
}
