/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useState} from 'react';
import {motion} from 'motion/react';
import {Search, Menu, ChevronRight, ArrowLeft, Loader2, Sparkles} from 'lucide-react';
import {GoogleGenAI} from '@google/genai';
import Markdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type BlogPost = {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  cachedContent?: string;
};

const blogPosts: BlogPost[] = [
  {id: 1, title: 'Como escolher a melhor plataforma de e-commerce', category: 'E-commerce', date: '23 Mar 2026', image: 'https://picsum.photos/seed/ecommerce/600/400', excerpt: 'Escolher a plataforma certa é o primeiro passo para o sucesso. Considere escalabilidade, custos e facilidade de uso.'},
  {id: 2, title: 'Dicas de marketing para aumentar suas vendas', category: 'Marketing', date: '20 Mar 2026', image: 'https://picsum.photos/seed/marketing/600/400', excerpt: 'O marketing digital é essencial. Invista em redes sociais, e-mail marketing e anúncios segmentados.'},
  {id: 3, title: 'Logística: Como otimizar suas entregas', category: 'Logística', date: '18 Mar 2026', image: 'https://picsum.photos/seed/logistics/600/400', excerpt: 'Entregas rápidas e baratas são diferenciais competitivos. Avalie parcerias com transportadoras.'},
  {id: 4, title: 'Gestão financeira para pequenas empresas', category: 'Gestão', date: '15 Mar 2026', image: 'https://picsum.photos/seed/finance/600/400', excerpt: 'Controle de fluxo de caixa é fundamental. Separe finanças pessoais de empresariais.'},
  {id: 5, title: 'SEO para lojas virtuais: Guia completo', category: 'Marketing', date: '12 Mar 2026', image: 'https://picsum.photos/seed/seo/600/400', excerpt: 'SEO ajuda sua loja a ser encontrada no Google. Foque em palavras-chave e descrições de produtos.'},
  {id: 6, title: 'Como criar cupons de desconto eficazes', category: 'Vendas', date: '10 Mar 2026', image: 'https://picsum.photos/seed/coupons/600/400', excerpt: 'Cupons podem atrair novos clientes, mas cuidado com a margem de lucro.'},
  {id: 7, title: 'Atendimento ao cliente: O segredo da fidelização', category: 'Gestão', date: '08 Mar 2026', image: 'https://picsum.photos/seed/support/600/400', excerpt: 'Um bom atendimento transforma clientes em promotores da marca.'},
  {id: 8, title: 'Tendências de e-commerce para 2026', category: 'E-commerce', date: '05 Mar 2026', image: 'https://picsum.photos/seed/trends/600/400', excerpt: 'Inteligência artificial e personalização são as grandes apostas para este ano.'},
];

export default function App() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [postContent, setPostContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePostClick = async (post: BlogPost) => {
    setSelectedPost(post);
    if (post.cachedContent) {
      setPostContent(post.cachedContent);
      return;
    }
    
    setIsGenerating(true);
    setPostContent('');
    try {
      const response = await ai.models.generateContentStream({
        model: 'gemini-3.1-pro-preview',
        contents: `Você é um especialista em e-commerce e negócios atuando no blog RNT.CORP. Escreva um artigo de blog profundo, detalhado e moderno sobre o tema "${post.title}" (Categoria: ${post.category}). 
        O conteúdo deve ser rico em detalhes, usar formatação Markdown (títulos H2/H3, listas, negrito), incluir estratégias acionáveis, dados de mercado simulados e ter um tom profissional, engajador e moderno. Não inclua o título principal (H1) no corpo do texto, pois ele já será exibido na página.`,
      });
      
      let fullText = '';
      for await (const chunk of response) {
        const chunkText = (chunk as any).text;
        if (chunkText) {
          fullText += chunkText;
          setPostContent(fullText);
        }
      }
      post.cachedContent = fullText;
    } catch (error) {
      console.error(error);
      setPostContent('**Erro ao gerar conteúdo.** Por favor, verifique sua conexão ou a chave da API e tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedPost(null)}>
            <span className="text-2xl font-bold text-blue-600">RNT.CORP</span>
            <span className="text-sm text-gray-500 font-medium">BLOG</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            {['Plataformas', 'Marketing', 'Vendas', 'Logística'].map(item => (
              <a key={item} href="#" className="hover:text-blue-600 transition-colors">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-gray-400 cursor-pointer" />
            <Menu className="w-6 h-6 md:hidden cursor-pointer" />
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {selectedPost ? (
          <motion.article 
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100"
          >
            <button onClick={() => setSelectedPost(null)} className="flex items-center text-blue-600 mb-8 hover:underline font-medium transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para os artigos
            </button>
            
            <div className="mb-8">
              <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-full mb-6">
                {selectedPost.category}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                {selectedPost.title}
              </h1>
              <div className="flex items-center text-gray-500 font-medium text-sm">
                <span>{selectedPost.date}</span>
                <span className="mx-3">•</span>
                <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                  <Sparkles className="w-3 h-3 mr-1.5" /> IA Generated
                </span>
              </div>
            </div>

            <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl mb-12 shadow-sm" referrerPolicy="no-referrer" />
            
            <div className="text-lg text-gray-700 leading-relaxed">
              {isGenerating && !postContent ? (
                <div className="flex flex-col items-center justify-center py-24 text-blue-600 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <Loader2 className="w-12 h-12 animate-spin mb-6" />
                  <p className="text-xl font-bold flex items-center gap-2 text-gray-900">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                    A Inteligência Artificial está escrevendo...
                  </p>
                  <p className="text-gray-500 mt-3 text-center max-w-md">Criando conteúdo profundo, exclusivo e detalhado sobre {selectedPost.title.toLowerCase()}.</p>
                </div>
              ) : (
                <div className="markdown-body">
                  <Markdown>{postContent}</Markdown>
                  {isGenerating && (
                    <span className="inline-block w-2 h-5 bg-blue-600 animate-pulse ml-1 align-middle"></span>
                  )}
                </div>
              )}
            </div>
          </motion.article>
        ) : (
          <>
            <motion.section 
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              className="text-center mb-20 mt-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-8 shadow-sm border border-blue-100">
                <Sparkles className="w-4 h-4" />
                <span>Conteúdo gerado por IA em tempo real</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-tight">
                O futuro do <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">E-commerce</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Aprenda como escolher, configurar e escalar sua loja virtual com artigos profundos gerados dinamicamente pela nossa Inteligência Artificial.
              </p>
            </motion.section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {blogPosts.map((post, index) => (
                <motion.div 
                  key={post.id}
                  initial={{opacity: 0, scale: 0.95}}
                  animate={{opacity: 1, scale: 1}}
                  transition={{delay: index * 0.1}}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group flex flex-col h-full"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="relative overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center text-xs text-gray-500 mb-4 font-medium">
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-0.5 rounded"><Sparkles className="w-3 h-3 mr-1"/> IA</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-8 line-clamp-3 flex-grow leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center text-sm font-bold text-blue-600 mt-auto group-hover:translate-x-1 transition-transform">
                      Ler artigo completo <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </section>
          </>
        )}
      </main>

      <footer className="bg-gray-900 text-gray-400 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-2xl font-bold text-white mb-4">RNT.CORP</div>
          <p className="text-sm mb-8 max-w-md mx-auto">Plataforma de simulação de blog de e-commerce com conteúdo gerado dinamicamente por Inteligência Artificial.</p>
          <div className="text-sm border-t border-gray-800 pt-8">
            &copy; 2026 RNT.CORP. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
