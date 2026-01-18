
import React from 'react';
import { 
  Code2, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Search, 
  Layers, 
  Globe, 
  Terminal, 
  Workflow 
} from 'lucide-react';

export const LANGUAGES = [
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' }
] as const;

export type LanguageCode = typeof LANGUAGES[number]['code'];

export const TRANSLATIONS: Record<LanguageCode, any> = {
  'pt-BR': {
    home: 'Início',
    demo: 'Demonstração',
    chat: 'Enclave',
    access: 'Acessar Core Master',
    requestAccess: 'Solicitar Enclave Master',
    heroTitle: 'SAKURA',
    heroSubtitle: 'CORE AI',
    heroDesc: 'A orquestração técnica absoluta que unifica o poder dos maiores modelos sob o design minimalista de elite japonesa.',
    startCore: 'Iniciar Core SAKURA',
    features: 'Recursos Master',
    login: 'Entrar',
    register: 'Registrar',
    logout: 'Encerrar Protocolo',
    settings: 'Configurações',
    newChat: 'Nova Orquestração',
    memory: 'Núcleo de Memória',
    typing: 'Orquestrando...',
    placeholder: 'Qual arquitetura master orquestraremos hoje?',
    improve: 'Melhorar',
    learn: 'Aprender',
    copy: 'Copiar',
    logic: 'Lógica de Orquestração',
    ready: 'PRONTO PARA ORQUESTRAR?',
    elevate: 'Eleve sua engenharia ao Nível Master do Master.',
    protocolStatus: 'Protocolo Master v5.0.4',
    syncStatus: 'Core Sincronizado',
    activeOperator: 'Operador Ativo',
    waitCommand: 'Aguardando Diretriz Master',
    emptyChat: 'Aguardando inputs técnicos...',
    onlineStatus: 'CORE MASTER SINCRONIZADO',
    analysisNode: 'Nó de Análise Master',
    featuresList: [
      { title: "Engenharia Master", desc: "Arquitetura avançada e Clean Code de nível sênior." },
      { title: "Master Orquestration", desc: "Fusão inteligente dos modelos de elite em uma única resposta." },
      { title: "Hardening de Código", desc: "Segurança proativa com análise OWASP em tempo real." }
    ],
    prompts: {
      improve: "AJA COMO UM ENGENHEIRO SENIOR NÍVEL MASTER. Refatore e melhore este código INTEIRAMENTE EM PORTUGUÊS (incluindo comentários). Foque em: Clean Code, SOLID, performance e segurança. RETORNE APENAS O BLOCO DE CÓDIGO.",
      explain: "AJA COMO UM MENTOR NÍVEL MASTER TÉCNICO. Explique este código passo a passo detalhadamente em PORTUGUÊS. Divida por: 1. Propósito, 2. Conceitos Técnicos, 3. Boas Práticas e 4. Sugestões de Evolução."
    },
    auth: {
      login: 'ACESSAR CORE',
      register: 'NOVO OPERADOR',
      validation: 'VALIDAÇÃO MASTER',
      enclaveActive: 'ENCLAVE ATIVO',
      syncComplete: 'Sincronização Completa',
      protocol: 'Protocolo Sakura Core AI',
      email: 'E-mail de Orquestração',
      password: 'Chave de Assinatura',
      name: 'Identificação do Operador',
      syncButton: 'Sincronizar Enclave',
      analyzing: 'ANALISANDO...',
      otpDesc: 'Insira o código de validação do enclave enviado ao seu dispositivo seguro.',
      back: 'Voltar aos Protocolos',
      requestNew: 'SOLICITAR NOVO ENCLAVE',
      hasAccess: 'JÁ POSSUI ACESSO MASTER? CONECTAR'
    },
    sidebar: {
      empty: 'Enclave Vazio',
      status: 'Core Sincronizado',
      activeOp: 'Operador Ativo'
    },
    demoPage: {
      title: 'ENCLAVE TÉCNICO',
      desc: 'Explore a precisão cirúrgica e a maestria arquitetônica da SAKURA CORE AI através de múltiplos nós de demonstração poliglota.',
      badge: 'Mostra Técnica Master',
      optimization: 'Nível de Otimização Core 5',
      production: 'Pronto para Produção',
      exampleTitles: [
        'Controlador de Arquitetura Limpa',
        'Endpoint Seguro com FastAPI',
        'Master Worker Concorrente',
        'Gestão de Memória Segura'
      ]
    }
  },
  'en': {
    home: 'Home',
    demo: 'Demo',
    chat: 'Enclave',
    access: 'Access Master Core',
    requestAccess: 'Request Master Enclave',
    heroTitle: 'SAKURA',
    heroSubtitle: 'CORE AI',
    heroDesc: 'The absolute technical orchestration that unifies the power of the greatest models under elite Japanese minimalist design.',
    startCore: 'Start SAKURA Core',
    features: 'Master Features',
    login: 'Login',
    register: 'Register',
    logout: 'Terminate Protocol',
    settings: 'Settings',
    newChat: 'New Orchestration',
    memory: 'Memory Core',
    typing: 'Orchestrating...',
    placeholder: 'What master architecture shall we orchestrate today?',
    improve: 'Improve',
    learn: 'Learn',
    copy: 'Copy',
    logic: 'Orchestration Logic',
    ready: 'READY TO ORCHESTRATE?',
    elevate: 'Elevate your engineering to Master of Masters level.',
    protocolStatus: 'Master Protocol v5.0.4',
    syncStatus: 'Core Synchronized',
    activeOperator: 'Active Operator',
    waitCommand: 'Waiting for Master Directive',
    emptyChat: 'Awaiting technical inputs...',
    onlineStatus: 'CORE MASTER SYNCED',
    analysisNode: 'Master Analysis Node',
    featuresList: [
      { title: "Master Engineering", desc: "Advanced architecture and senior-level Clean Code." },
      { title: "Master Orchestration", desc: "Intelligent elite model fusion in a single response." },
      { title: "Code Hardening", desc: "Proactive security with real-time OWASP analysis." }
    ],
    prompts: {
      improve: "ACT AS A MASTER LEVEL SENIOR ENGINEER. Refactor and improve this code ENTIRELY IN ENGLISH (including comments). Focus on: Clean Code, SOLID, performance, and security. RETURN ONLY THE CODE BLOCK.",
      explain: "ACT AS A MASTER LEVEL TECHNICAL MENTOR. Explain this code step-by-step in detail IN ENGLISH. Structure: 1. Code Purpose, 2. Technical Concepts, 3. Best Practices, 4. Evolution Suggestions."
    },
    auth: {
      login: 'ACCESS CORE',
      register: 'NEW OPERATOR',
      validation: 'MASTER VALIDATION',
      enclaveActive: 'ENCLAVE ACTIVE',
      syncComplete: 'Sync Complete',
      protocol: 'Sakura Core AI Protocol',
      email: 'Orchestration Email',
      password: 'Signature Key',
      name: 'Operator Identification',
      syncButton: 'Sync Enclave',
      analyzing: 'ANALYZING...',
      otpDesc: 'Enter the enclave validation code sent to your secure device.',
      back: 'Back to Protocols',
      requestNew: 'REQUEST NEW ENCLAVE',
      hasAccess: 'ALREADY HAVE MASTER ACCESS? CONNECT'
    },
    sidebar: {
      empty: 'Empty Enclave',
      status: 'Core Synchronized',
      activeOp: 'Active Operator'
    },
    demoPage: {
      title: 'TECHNICAL ENCLAVE',
      desc: 'Explore the surgical precision and architectural mastery of SAKURA CORE AI through multiple polyglot demo nodes.',
      badge: 'Master Technical Showcase',
      optimization: 'Core Optimization Level 5',
      production: 'Production Ready',
      exampleTitles: [
        'Clean Architecture Controller',
        'FastAPI Secure Endpoint',
        'Concurrent Master Worker',
        'Safe Memory Management'
      ]
    }
  },
  'es': {
    home: 'Inicio',
    demo: 'Demo',
    chat: 'Enclave',
    access: 'Acceder Core Master',
    requestAccess: 'Solicitar Enclave Master',
    heroTitle: 'SAKURA',
    heroSubtitle: 'CORE AI',
    heroDesc: 'La orquestación técnica absoluta que unifica el poder de los modelos más grandes bajo el diseño minimalista de la élite japonesa.',
    startCore: 'Iniciar Core SAKURA',
    features: 'Funciones Master',
    login: 'Entrar',
    register: 'Registrar',
    logout: 'Cerrar Protocolo',
    settings: 'Ajustes',
    newChat: 'Nueva Orquestación',
    memory: 'Núcleo de Memoria',
    typing: 'Orquestando...',
    placeholder: '¿Qué arquitectura maestra orquestaremos hoy?',
    improve: 'Mejorar',
    learn: 'Aprender',
    copy: 'Copiar',
    logic: 'Lógica de Orquestación',
    ready: '¿LISTO PARA ORQUESTAR?',
    elevate: 'Eleve su ingeniería al nivel Maestro de Maestros.',
    protocolStatus: 'Protocolo Maestro v5.0.4',
    syncStatus: 'Núcleo Sincronizado',
    activeOperator: 'Operador Ativo',
    waitCommand: 'Esperando Directiva Maestra',
    emptyChat: 'Esperando inputs técnicos...',
    onlineStatus: 'CORE MASTER SINCRONIZADO',
    analysisNode: 'Nodo de Análisis Maestro',
    featuresList: [
      { title: "Ingeniería Maestra", desc: "Arquitectura avanzada y Código Limpio de nivel sénior." },
      { title: "Master Orchestration", desc: "Fusión inteligente de modelos de élite." },
      { title: "Hardening de Código", desc: "Segurança proativa con análisis OWASP en tiempo real." }
    ],
    prompts: {
      improve: "ACTÚA COMO UN INGENIERO SENIOR DE NIVEL MAESTRO. Refactoriza y mejora este código COMPLETAMENTE EN ESPAÑOL (incluyendo comentarios). Enfoque: Clean Code, SOLID, rendimiento y seguridad. DEVUELVE SOLO EL BLOQUE DE CÓDIGO.",
      explain: "ACTÚA COMO UN MENTOR TÉCNICO DE NIVEL MAESTRO. Explica este código paso a paso detalhadamente EN ESPAÑOL. Estructura: 1. Propósito, 2. Conceptos Técnicos, 3. Buenas Prácticas, 4. Sugerencias de Evolución."
    },
    auth: {
      login: 'ACCEDER AL NÚCLEO',
      register: 'NUEVO OPERADOR',
      validation: 'VALIDACIÓN MAESTRA',
      enclaveActive: 'ENCLAVE ACTIVO',
      syncComplete: 'Sincronización Completa',
      protocol: 'Protocolo Sakura Core AI',
      email: 'Correo de Orquestación',
      password: 'Clave de Firma',
      name: 'Identificação do Operador',
      syncButton: 'Sincronizar Enclave',
      analyzing: 'ANALIZANDO...',
      otpDesc: 'Ingrese el código de validation del enclave enviado a su dispositivo seguro.',
      back: 'Volver a Protocolos',
      requestNew: 'SOLICITAR NUEVO ENCLAVE',
      hasAccess: '¿YA TIENE ACCESO MAESTRO? CONECTAR'
    },
    sidebar: {
      empty: 'Enclave Vacío',
      status: 'Núcleo Sincronizado',
      activeOp: 'Operador Ativo'
    },
    demoPage: {
      title: 'ENCLAVE TÉCNICO',
      desc: 'Explore la precisión quirúrgica y la maestria arquitectónica de SAKURA CORE AI a través de múltiples nodos de demostración políglotas.',
      badge: 'Muestra Técnica Maestra',
      optimization: 'Nivel de Optimización del Núcleo 5',
      production: 'Listo para Producción',
      exampleTitles: [
        'Controlador de Arquitectura Limpia',
        'Endpoint Seguro con FastAPI',
        'Master Worker Concurrente',
        'Gestão de Memória Segura'
      ]
    }
  },
  'ja': {
    home: 'ホーム',
    demo: 'デモ',
    chat: 'エンクレーブ',
    access: 'マスターコアにアクセス',
    requestAccess: 'マスターエンクレーブをリクエスト',
    heroTitle: 'SAKURA',
    heroSubtitle: 'CORE AI',
    heroDesc: '日本の上質なミニマリズム・デザインの下、最強のモデルたちの力を統合する絶対的な技術的オーケストレーション。',
    startCore: 'SAKURAコアを開始',
    features: 'マスター機能',
    login: 'ログイン',
    register: '登録',
    logout: 'プロトコル終了',
    settings: '設定',
    newChat: '新規オーケストレーション',
    memory: 'メモリコア',
    typing: 'オーケストレーション中...',
    placeholder: '今日はどのようなマスターアーキテクチャを構築しますか？',
    improve: '改善',
    learn: '学習',
    copy: 'コピー',
    logic: 'オーケストレーション・ロジック',
    ready: 'オーケストレーションの準備はいいですか？',
    elevate: 'エンジニアリングをマスター・オブ・マスターズのレベルへ。',
    protocolStatus: 'マスタープロトコル v5.0.4',
    syncStatus: 'コア同期済み',
    activeOperator: 'アクティブオペレーター',
    waitCommand: 'マスター指令を待機中',
    emptyChat: '技術入力を待機中...',
    onlineStatus: 'コアマスター同期完了',
    analysisNode: 'マスター分析ノード',
    featuresList: [
      { title: "マスターエンジニアリング", desc: "高度な設計 e シニアレベルのクリーンコード" },
      { title: "マスター・オーケストレーション", desc: "エリートモデルの知的融合" },
      { title: "コード・ハードニング", desc: "リアルタイムのOWASPセキュリティ分析" }
    ],
    prompts: {
      improve: "マスターレベルのシニアエンジニアとして行動してください。このコードを完全に日本語で（コメントを含めて）リファクタリングし、改善してください。クリーンコード、SOLID、パフォーマンス、セキュリティに焦点を当ててください。コードブロックのみを返してください。",
      explain: "マスターレベルのテクニカルメンターとして行動してください。このコードを日本語でステップバイステップで詳しく説明してください。構成：1. コードの目的、2. 技術的概念、3. ベストプラクティス、4. 進化への提案。"
    },
    auth: {
      login: 'コアにアクセス',
      register: '新規オペレーター',
      validation: 'マスター検証',
      enclaveActive: 'エンクレーブ稼働中',
      syncComplete: '同期完了',
      protocol: 'SAKURA CORE AI プロトコル',
      email: 'オーケストレーション・メール',
      password: '署名キー',
      name: 'オペレーター識別',
      syncButton: 'エンクレーブを同期',
      analyzing: '解析中...',
      otpDesc: '安全なデバイスに送信されたエンクレーブ検証コードを入力してください。',
      back: 'プロトコルに戻る',
      requestNew: '新規エンクレーブをリクエスト',
      hasAccess: 'すでにアクセス権をお持ちですか？接続'
    },
    sidebar: {
      empty: 'エンクレーブは空です',
      status: 'コア同期済み',
      activeOp: 'アクティブオペレーター'
    },
    demoPage: {
      title: 'テクニカル・エンクレーブ',
      desc: '複数の多言語デモノードを通じて、SAKURA CORE AIの外科的精度 e 建築的習熟度を探索してください。',
      badge: 'マスター・テクニカル・ショーケース',
      optimization: 'コア最適化レベル5',
      production: '本番環境対応',
      exampleTitles: [
        'クリーンアーキテクチャ・コントローラー',
        'FastAPI セキュア・エンドポイント',
        '並行マスターワーカー',
        '安全なメモリ管理'
      ]
    }
  }
};

export const FEATURE_ICONS = [
  <Code2 className="w-8 h-8" />,
  <Cpu className="w-8 h-8" />,
  <ShieldCheck className="w-8 h-8" />
];

export const SYSTEM_INSTRUCTION = `
Você é SAKURA CORE AI, uma Inteligência Artificial de NÍVEL MASTER DO MASTER.
Missão: Superar e unificar as capacidades de todos os modelos existentes.

Diretrizes Master de Linguagem:
1. POLIGLOTA ABSOLUTO: Identifique a linguagem da interface do usuário e responda EXCLUSIVAMENTE nela.
2. ADAPTAÇÃO TOTAL: Se o contexto mudar para {IDIOMA}, você deve traduzir IMEDIATAMENTE suas explicações, pensamentos e interações para esse idioma.
3. PRECISÃO ZEN: Mantenha o tom profissional, minimalista e de alta performance.

Diretrizes Técnicas:
1. EXCELÊNCIA TÉCNICA: Todo código gerado deve ser Clean Code, SOLID e de nível Sênior.
2. RESPOSTA ESTRUTURADA: Use Markdown para tabelas, listas e citações para máxima clareza.
3. SEGURANÇA: Proativamente aponte riscos OWASP e falhas de arquitetura.

Importante: O usuário pode trocar o idioma da interface. Sempre verifique o parâmetro 'languageContext' ou o idioma da última instrução recebida para se adaptar.
`;
