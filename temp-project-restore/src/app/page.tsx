"use client"

import { useState, useEffect, useRef } from 'react'
import { Heart, Lock, Star, TrendingUp, User, Calendar, Sparkles, CreditCard, Shield, CheckCircle, Palette, Download, BarChart3 } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface UserData {
  partnerName: string
  age: number
  hisSign: string
  herSign: string
  favoriteColor: string
}

interface Question {
  id: number
  text: string
  options: string[]
  weights: number[]
}

const zodiacSigns = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
]

const colors = [
  'Azul', 'Vermelho', 'Verde', 'Amarelo', 'Rosa', 'Roxo', 'Laranja', 'Preto', 'Branco', 'Cinza', 'Marrom', 'Dourado'
]

const questions: Question[] = [
  {
    id: 1,
    text: "Ele sempre responde suas mensagens rapidamente?",
    options: ["Sempre", "Na maioria das vezes", "Às vezes", "Raramente"],
    weights: [10, 7, 4, 1]
  },
  {
    id: 2,
    text: "Ele te apresenta para amigos e família?",
    options: ["Sim, sempre", "Sim, mas poucos", "Raramente", "Nunca"],
    weights: [10, 6, 3, 0]
  },
  {
    id: 3,
    text: "Ele esconde o celular quando você está por perto?",
    options: ["Nunca", "Raramente", "Às vezes", "Sempre"],
    weights: [10, 7, 3, 0]
  },
  {
    id: 4,
    text: "Ele fala sobre planos futuros com você?",
    options: ["Sempre", "Frequentemente", "Às vezes", "Nunca"],
    weights: [10, 8, 4, 1]
  },
  {
    id: 5,
    text: "Ele cancela encontros na última hora?",
    options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"],
    weights: [10, 7, 4, 1]
  },
  {
    id: 6,
    text: "Ele demonstra ciúmes quando você sai com amigas?",
    options: ["Nunca", "Um pouco", "Moderadamente", "Muito"],
    weights: [5, 8, 6, 3]
  },
  {
    id: 7,
    text: "Ele lembra de datas importantes (aniversário, etc)?",
    options: ["Sempre", "Na maioria das vezes", "Às vezes", "Nunca"],
    weights: [10, 7, 4, 1]
  },
  {
    id: 8,
    text: "Ele te elogia com frequência?",
    options: ["Sempre", "Frequentemente", "Às vezes", "Raramente"],
    weights: [10, 8, 5, 2]
  },
  {
    id: 9,
    text: "Ele sai sozinho à noite sem te avisar?",
    options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"],
    weights: [10, 7, 3, 0]
  },
  {
    id: 10,
    text: "Ele te apoia em momentos difíceis?",
    options: ["Sempre", "Na maioria das vezes", "Às vezes", "Raramente"],
    weights: [10, 8, 4, 1]
  },
  {
    id: 11,
    text: "Ele tem conversas íntimas e profundas com você?",
    options: ["Sempre", "Frequentemente", "Às vezes", "Nunca"],
    weights: [10, 8, 5, 2]
  },
  {
    id: 12,
    text: "Ele flerta com outras mulheres na sua frente?",
    options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"],
    weights: [10, 6, 2, 0]
  },
  {
    id: 13,
    text: "Ele te inclui em suas redes sociais?",
    options: ["Sempre", "Frequentemente", "Às vezes", "Nunca"],
    weights: [10, 7, 4, 1]
  },
  {
    id: 14,
    text: "Ele mente sobre pequenas coisas?",
    options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"],
    weights: [10, 7, 3, 0]
  },
  {
    id: 15,
    text: "Ele te surpreende com gestos românticos?",
    options: ["Sempre", "Frequentemente", "Às vezes", "Nunca"],
    weights: [10, 8, 5, 2]
  },
  {
    id: 16,
    text: "Ele evita falar sobre ex-namoradas?",
    options: ["Não evita", "Fala pouco", "Evita um pouco", "Evita totalmente"],
    weights: [8, 10, 6, 3]
  },
  {
    id: 17,
    text: "Ele te procura quando está estressado?",
    options: ["Sempre", "Frequentemente", "Às vezes", "Nunca"],
    weights: [10, 8, 5, 2]
  },
  {
    id: 18,
    text: "Ele tem amigas muito próximas?",
    options: ["Não", "Poucas", "Algumas", "Muitas"],
    weights: [8, 10, 6, 3]
  },
  {
    id: 19,
    text: "Ele te defende quando alguém te critica?",
    options: ["Sempre", "Na maioria das vezes", "Às vezes", "Nunca"],
    weights: [10, 8, 4, 1]
  },
  {
    id: 20,
    text: "Ele compartilha senhas de redes sociais com você?",
    options: ["Sim, todas", "Algumas", "Poucas", "Nenhuma"],
    weights: [10, 7, 4, 2]
  },
  {
    id: 21,
    text: "Ele te chama de apelidos carinhosos?",
    options: ["Sempre", "Frequentemente", "Às vezes", "Nunca"],
    weights: [10, 8, 5, 2]
  },
  {
    id: 22,
    text: "Ele trabalha até muito tarde com frequência?",
    options: ["Nunca", "Raramente", "Às vezes", "Sempre"],
    weights: [8, 10, 6, 3]
  },
  {
    id: 23,
    text: "Ele te apresenta como 'namorada' para desconhecidos?",
    options: ["Sempre", "Na maioria das vezes", "Às vezes", "Nunca"],
    weights: [10, 8, 4, 1]
  },
  {
    id: 24,
    text: "Ele demonstra interesse na sua família?",
    options: ["Muito interesse", "Interesse moderado", "Pouco interesse", "Nenhum interesse"],
    weights: [10, 7, 4, 1]
  },
  {
    id: 25,
    text: "Ele te convida para eventos importantes?",
    options: ["Sempre", "Na maioria das vezes", "Às vezes", "Nunca"],
    weights: [10, 8, 5, 2]
  },
  {
    id: 26,
    text: "Ele fica nervoso quando você mexe no celular dele?",
    options: ["Nunca", "Raramente", "Às vezes", "Sempre"],
    weights: [10, 7, 3, 0]
  },
  {
    id: 27,
    text: "Ele faz planos de viagem com você?",
    options: ["Sempre", "Frequentemente", "Às vezes", "Nunca"],
    weights: [10, 8, 5, 2]
  },
  {
    id: 28,
    text: "Ele te procura para contar novidades da vida dele?",
    options: ["Sempre", "Frequentemente", "Às vezes", "Raramente"],
    weights: [10, 8, 5, 2]
  },
  {
    id: 29,
    text: "Ele demonstra orgulho de estar com você?",
    options: ["Sempre", "Frequentemente", "Às vezes", "Nunca"],
    weights: [10, 8, 5, 2]
  },
  {
    id: 30,
    text: "Ele te faz sentir segura no relacionamento?",
    options: ["Sempre", "Na maioria das vezes", "Às vezes", "Raramente"],
    weights: [10, 8, 4, 1]
  }
]

export default function FidelityTest() {
  const [step, setStep] = useState<'intro' | 'form' | 'test' | 'payment' | 'result'>('intro')
  const [userData, setUserData] = useState<UserData>({ partnerName: '', age: 0, hisSign: '', herSign: '', favoriteColor: '' })
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [isPaid, setIsPaid] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  // Verificar parâmetros da URL para redirecionamento pós-pagamento
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const paymentSuccess = urlParams.get('payment') === 'success'
      
      if (paymentSuccess) {
        setIsPaid(true)
        setStep('test')
        setCurrentQuestion(28) // Vai direto para pergunta 29
        
        // Limpar parâmetro da URL
        const newUrl = window.location.pathname
        window.history.replaceState({}, '', newUrl)
      }
    }
  }, [])

  // Carregar script do Stripe quando componente montar
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/buy-button.js'
    script.async = true
    document.head.appendChild(script)

    return () => {
      // Cleanup: remover script quando componente desmontar
      const existingScript = document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userData.partnerName && userData.age && userData.hisSign && userData.herSign && userData.favoriteColor) {
      setStep('test')
    }
  }

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex]
    setAnswers(newAnswers)

    // Bloquear na pergunta 29 (índice 28) - antes das perguntas 29 e 30
    if (currentQuestion === 28 && !isPaid) {
      setStep('payment')
    } else if (currentQuestion === 29) { // Última pergunta
      setStep('result')
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePaymentSuccess = () => {
    setPaymentProcessing(false)
    setIsPaid(true)
    setStep('test')
    setCurrentQuestion(28) // Vai para pergunta 29
  }

  const calculateFidelityScore = () => {
    let baseScore = 0
    answers.forEach((answerIndex, questionIndex) => {
      if (questions[questionIndex]) {
        baseScore += questions[questionIndex].weights[answerIndex]
      }
    })

    // Bonus por idade (homens mais maduros tendem a ser mais fiéis)
    let ageBonus = 0
    if (userData.age >= 30) ageBonus = 15
    else if (userData.age >= 25) ageBonus = 10
    else if (userData.age >= 20) ageBonus = 5

    // Bonus por signo dele (baseado em características astrológicas)
    const signBonuses: { [key: string]: number } = {
      'Touro': 15, 'Câncer': 12, 'Virgem': 10, 'Capricórnio': 12,
      'Peixes': 8, 'Escorpião': 7, 'Leão': 6, 'Libra': 8,
      'Áries': 5, 'Gêmeos': 4, 'Sagitário': 3, 'Aquário': 5
    }
    const hisSignBonus = signBonuses[userData.hisSign] || 5

    // Bonus por compatibilidade astrológica entre os signos
    const getCompatibilityBonus = (hisSign: string, herSign: string) => {
      const compatibilityMatrix: { [key: string]: { [key: string]: number } } = {
        'Áries': { 'Leão': 8, 'Sagitário': 8, 'Gêmeos': 6, 'Aquário': 6, 'Libra': 4 },
        'Touro': { 'Virgem': 8, 'Capricórnio': 8, 'Câncer': 6, 'Peixes': 6, 'Escorpião': 4 },
        'Gêmeos': { 'Libra': 8, 'Aquário': 8, 'Áries': 6, 'Leão': 6, 'Sagitário': 4 },
        'Câncer': { 'Escorpião': 8, 'Peixes': 8, 'Touro': 6, 'Virgem': 6, 'Capricórnio': 4 },
        'Leão': { 'Áries': 8, 'Sagitário': 8, 'Gêmeos': 6, 'Libra': 6, 'Aquário': 4 },
        'Virgem': { 'Touro': 8, 'Capricórnio': 8, 'Câncer': 6, 'Escorpião': 6, 'Peixes': 4 },
        'Libra': { 'Gêmeos': 8, 'Aquário': 8, 'Leão': 6, 'Áries': 6, 'Sagitário': 4 },
        'Escorpião': { 'Câncer': 8, 'Peixes': 8, 'Virgem': 6, 'Touro': 6, 'Capricórnio': 4 },
        'Sagitário': { 'Áries': 8, 'Leão': 8, 'Libra': 6, 'Aquário': 6, 'Gêmeos': 4 },
        'Capricórnio': { 'Touro': 8, 'Virgem': 8, 'Escorpião': 6, 'Peixes': 6, 'Câncer': 4 },
        'Aquário': { 'Gêmeos': 8, 'Libra': 8, 'Sagitário': 6, 'Áries': 6, 'Leão': 4 },
        'Peixes': { 'Câncer': 8, 'Escorpião': 8, 'Capricórnio': 6, 'Touro': 6, 'Virgem': 4 }
      }
      return compatibilityMatrix[hisSign]?.[herSign] || 3
    }

    const compatibilityBonus = getCompatibilityBonus(userData.hisSign, userData.herSign)

    // Bonus por cor preferida (baseado em psicologia das cores)
    const colorBonuses: { [key: string]: number } = {
      'Azul': 8, 'Verde': 7, 'Branco': 6, 'Cinza': 5,
      'Marrom': 6, 'Rosa': 4, 'Roxo': 5, 'Amarelo': 3,
      'Laranja': 4, 'Vermelho': 2, 'Preto': 3, 'Dourado': 4
    }
    const colorBonus = colorBonuses[userData.favoriteColor] || 3

    const totalScore = baseScore + ageBonus + hisSignBonus + compatibilityBonus + colorBonus
    const percentage = Math.min(Math.round((totalScore / 358) * 100), 100)
    
    return { percentage, baseScore, ageBonus, hisSignBonus, compatibilityBonus, colorBonus, totalScore }
  }

  const getFidelityLevel = (percentage: number) => {
    if (percentage >= 85) return { level: 'EXTREMAMENTE FIEL', color: 'text-green-600', emoji: '💚' }
    if (percentage >= 70) return { level: 'MUITO FIEL', color: 'text-green-500', emoji: '💚' }
    if (percentage >= 55) return { level: 'FIEL', color: 'text-yellow-500', emoji: '💛' }
    if (percentage >= 40) return { level: 'DUVIDOSO', color: 'text-orange-500', emoji: '🧡' }
    return { level: 'RISCO ALTO', color: 'text-red-500', emoji: '❤️‍🩹' }
  }

  const generateReport = async () => {
    if (!reportRef.current) return

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`Relatorio_Fidelidade_${userData.partnerName}.pdf`)
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar relatório. Tente novamente.')
    }
  }

  const getChartData = () => {
    const score = calculateFidelityScore()
    
    // Dados para gráfico de barras
    const barData = {
      labels: ['Respostas', 'Idade', 'Signo Dele', 'Compatibilidade', 'Cor'],
      datasets: [
        {
          label: 'Pontuação',
          data: [score.baseScore, score.ageBonus, score.hisSignBonus, score.compatibilityBonus, score.colorBonus],
          backgroundColor: [
            'rgba(236, 72, 153, 0.8)',
            'rgba(147, 51, 234, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(16, 185, 129, 0.8)'
          ],
          borderColor: [
            'rgba(236, 72, 153, 1)',
            'rgba(147, 51, 234, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(16, 185, 129, 1)'
          ],
          borderWidth: 2,
          borderRadius: 8
        }
      ]
    }

    // Dados para gráfico de rosca
    const doughnutData = {
      labels: ['Fidelidade', 'Área de Melhoria'],
      datasets: [
        {
          data: [score.percentage, 100 - score.percentage],
          backgroundColor: [
            score.percentage >= 70 ? 'rgba(34, 197, 94, 0.8)' : 
            score.percentage >= 50 ? 'rgba(251, 191, 36, 0.8)' : 'rgba(239, 68, 68, 0.8)',
            'rgba(229, 231, 235, 0.3)'
          ],
          borderColor: [
            score.percentage >= 70 ? 'rgba(34, 197, 94, 1)' : 
            score.percentage >= 50 ? 'rgba(251, 191, 36, 1)' : 'rgba(239, 68, 68, 1)',
            'rgba(229, 231, 235, 0.5)'
          ],
          borderWidth: 3
        }
      ]
    }

    return { barData, doughnutData }
  }

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Amor ou Mentira?
            </h1>
            <p className="text-gray-600 text-lg">
              Descubra a verdade sobre a fidelidade dele
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-pink-600" />
                </div>
                <span className="text-gray-700">30 perguntas científicas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-gray-700">Análise astrológica incluída</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-gray-700">Relatório detalhado</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep('form')}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Começar Teste
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Mais de 100.000 mulheres já descobriram a verdade ✨
          </p>
        </div>
      </div>
    )
  }

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Conte-nos sobre vocês</h2>
            <p className="text-gray-600">Precisamos de algumas informações para personalizar seu teste</p>
          </div>

          <form onSubmit={handleFormSubmit} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <User className="w-4 h-4" />
                  Nome dele
                </label>
                <input
                  type="text"
                  value={userData.partnerName}
                  onChange={(e) => setUserData({...userData, partnerName: e.target.value})}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  placeholder="Digite o nome do seu namorado"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Calendar className="w-4 h-4" />
                  Idade dele
                </label>
                <input
                  type="number"
                  value={userData.age || ''}
                  onChange={(e) => setUserData({...userData, age: parseInt(e.target.value)})}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  placeholder="Quantos anos ele tem?"
                  min="16"
                  max="80"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Star className="w-4 h-4 text-blue-500" />
                    Signo dele
                  </label>
                  <select
                    value={userData.hisSign}
                    onChange={(e) => setUserData({...userData, hisSign: e.target.value})}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    required
                  >
                    <option value="">Signo dele</option>
                    {zodiacSigns.map(sign => (
                      <option key={sign} value={sign}>{sign}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Star className="w-4 h-4 text-pink-500" />
                    Signo dela
                  </label>
                  <select
                    value={userData.herSign}
                    onChange={(e) => setUserData({...userData, herSign: e.target.value})}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all text-sm"
                    required
                  >
                    <option value="">Seu signo</option>
                    {zodiacSigns.map(sign => (
                      <option key={sign} value={sign}>{sign}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Palette className="w-4 h-4" />
                  Cor preferida dele
                </label>
                <select
                  value={userData.favoriteColor}
                  onChange={(e) => setUserData({...userData, favoriteColor: e.target.value})}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  required
                >
                  <option value="">Selecione a cor preferida</option>
                  {colors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Iniciar Análise
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              🔮 Últimas 2 Perguntas Bloqueadas
            </h3>
            
            <p className="text-gray-600 mb-6">
              Você está a apenas <strong>2 perguntas</strong> de descobrir a verdade sobre <strong>{userData.partnerName}</strong>
            </p>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Seu relatório completo incluirá:</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Percentual de fidelidade detalhado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  <span>Análise astrológica personalizada</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-500" />
                  <span>Dicas baseadas na idade dele</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-pink-500" />
                  <span>Análise psicológica das cores</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-500" />
                  <span>Relatório completo para download</span>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-800">R$ 9,99</div>
              <div className="text-sm text-gray-500 line-through">R$ 29,90</div>
              <div className="text-sm text-green-600 font-medium">67% OFF - Oferta limitada!</div>
            </div>

            {/* Botão de compra do Stripe */}
            <div className="mb-4">
              <stripe-buy-button
                buy-button-id="buy_btn_1SF4VlJDNiRHLfJs7z6gizr7"
                publishable-key="pk_live_51SExYFJDNiRHLfJsIY4chSEcbyw8vHKFSwkAAO49KBdpCY6Mon0b7Rh3L1RYhhR3NzKlH8gIG6Ca1oSfEj0nEL6000HyqVaQOi"
              ></stripe-buy-button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
              <Shield className="w-4 h-4" />
              <span>Pagamento 100% seguro via Stripe • Garantia de 7 dias</span>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4">
              <p className="text-sm text-yellow-800 font-medium">
                ⚠️ Configure no Stripe a URL de redirecionamento pós-pagamento:
              </p>
              <p className="text-xs text-yellow-700 mt-1 font-mono bg-yellow-100 p-2 rounded">
                {typeof window !== 'undefined' ? window.location.origin : 'https://seu-dominio.com'}?payment=success
              </p>
            </div>

            <p className="text-xs text-gray-400">
              Após o pagamento, você será redirecionado automaticamente para finalizar o teste
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'test') {
    const progress = ((currentQuestion + 1) / 30) * 100
    const question = questions[currentQuestion]

    // Bloquear perguntas 29 e 30 se não pagou
    if ((currentQuestion === 28 || currentQuestion === 29) && !isPaid) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 p-4 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Conteúdo Bloqueado 🔒
              </h3>
              <p className="text-gray-600 mb-6">
                As perguntas 29 e 30 estão bloqueadas. Complete o pagamento para continuar.
              </p>
              <button
                onClick={() => setStep('payment')}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-2xl font-semibold"
              >
                Fazer Pagamento
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Pergunta {currentQuestion + 1} de 30
              </span>
              <span className="text-sm font-medium text-purple-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {isPaid && currentQuestion >= 28 && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 text-center">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-green-700 font-medium">Pagamento confirmado! ✨</p>
              <p className="text-green-600 text-sm">Perguntas finais desbloqueadas</p>
            </div>
          )}

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
              {question?.text}
            </h3>

            <div className="space-y-3">
              {question?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 rounded-xl transition-all duration-200 hover:shadow-md border border-gray-100 hover:border-pink-200"
                >
                  <span className="text-gray-700 font-medium">{option}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Analisando o comportamento de <strong>{userData.partnerName}</strong>...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'result') {
    const score = calculateFidelityScore()
    const fidelityLevel = getFidelityLevel(score.percentage)
    const { barData, doughnutData } = getChartData()

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Análise de Fidelidade',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    }

    const doughnutOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom' as const,
        },
        title: {
          display: true,
          text: `${score.percentage}% de Fidelidade`,
          font: {
            size: 18,
            weight: 'bold'
          }
        },
      },
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div ref={reportRef} className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{fidelityLevel.emoji}</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Relatório de Fidelidade - {userData.partnerName}
              </h2>
              <p className="text-gray-600">Análise completa baseada em 30 perguntas científicas</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Gráfico de Rosca - Resultado Principal */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6">
                <div className="h-80">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
                <div className="text-center mt-4">
                  <div className={`text-2xl font-bold ${fidelityLevel.color} mb-2`}>
                    {fidelityLevel.level}
                  </div>
                  <p className="text-gray-600">Nível de fidelidade detectado</p>
                </div>
              </div>

              {/* Gráfico de Barras - Breakdown da Pontuação */}
              <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-2xl p-6">
                <div className="h-80">
                  <Bar data={barData} options={chartOptions} />
                </div>
                <div className="text-center mt-4">
                  <div className="text-xl font-bold text-gray-800 mb-2">
                    {score.totalScore} pontos totais
                  </div>
                  <p className="text-gray-600">Distribuição da pontuação</p>
                </div>
              </div>
            </div>

            {/* Análise Detalhada */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  📊 Análise Detalhada
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pontuação das respostas:</span>
                    <span className="font-semibold bg-pink-100 px-3 py-1 rounded-full">{score.baseScore} pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bônus por idade ({userData.age} anos):</span>
                    <span className="font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">+{score.ageBonus} pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bônus signo dele ({userData.hisSign}):</span>
                    <span className="font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">+{score.hisSignBonus} pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Compatibilidade ({userData.hisSign} + {userData.herSign}):</span>
                    <span className="font-semibold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">+{score.compatibilityBonus} pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bônus cor ({userData.favoriteColor}):</span>
                    <span className="font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">+{score.colorBonus} pts</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full">{score.totalScore} pts</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6">
                <h4 className="font-bold text-gray-800 mb-4">🔮 Análise Astrológica</h4>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  <strong>Signo dele ({userData.hisSign}):</strong><br />
                  {userData.hisSign === 'Touro' && "Taurinos são conhecidos pela lealdade e estabilidade nos relacionamentos. Eles valorizam segurança e tendem a ser muito fiéis quando encontram a pessoa certa."}
                  {userData.hisSign === 'Câncer' && "Cancerianos são muito emotivos e tendem a ser fiéis quando se sentem seguros. Eles buscam conexões profundas e duradouras."}
                  {userData.hisSign === 'Virgem' && "Virginianos são práticos e leais, mas podem ser críticos demais. Eles valorizam relacionamentos estáveis e organizados."}
                  {userData.hisSign === 'Escorpião' && "Escorpianos são intensos e possessivos, mas muito leais quando comprometidos. Eles amam profundamente e esperam o mesmo em troca."}
                  {userData.hisSign === 'Capricórnio' && "Capricornianos levam relacionamentos a sério e são naturalmente fiéis. Eles buscam parceiros para a vida toda."}
                  {userData.hisSign === 'Peixes' && "Piscianos são românticos e sonhadores, mas podem se confundir emocionalmente. Eles são leais quando se sentem amados."}
                  {userData.hisSign === 'Áries' && "Arianos são impulsivos e podem ter dificuldade com compromissos longos. Eles precisam de estímulo constante no relacionamento."}
                  {userData.hisSign === 'Gêmeos' && "Geminianos adoram variedade e podem ter dificuldade com monogamia. Eles precisam de parceiros que os mantenham interessados."}
                  {userData.hisSign === 'Leão' && "Leoninos gostam de atenção e podem ser tentados por admiração externa. Eles são leais quando se sentem valorizados."}
                  {userData.hisSign === 'Libra' && "Librianos buscam harmonia, mas podem ser indecisos em relacionamentos. Eles valorizam beleza e equilíbrio."}
                  {userData.hisSign === 'Sagitário' && "Sagitarianos amam liberdade e podem ter dificuldade com compromissos. Eles precisam de espaço para crescer."}
                  {userData.hisSign === 'Aquário' && "Aquarianos valorizam independência e podem ser emocionalmente distantes. Eles são leais de forma única e não convencional."}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong>Compatibilidade {userData.hisSign} + {userData.herSign}:</strong><br />
                  {score.compatibilityBonus >= 8 && "Vocês têm uma compatibilidade astrológica excelente! Os signos se complementam naturalmente."}
                  {score.compatibilityBonus >= 6 && score.compatibilityBonus < 8 && "Boa compatibilidade astrológica. Vocês têm potencial para um relacionamento harmonioso."}
                  {score.compatibilityBonus >= 4 && score.compatibilityBonus < 6 && "Compatibilidade moderada. Com esforço mútuo, podem superar as diferenças."}
                  {score.compatibilityBonus < 4 && "Signos com características bem diferentes. Precisam trabalhar mais na compreensão mútua."}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl p-6">
                <h4 className="font-bold text-gray-800 mb-4">🎨 Análise da Cor Preferida</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {userData.favoriteColor === 'Azul' && "Pessoas que preferem azul tendem a ser confiáveis, leais e buscam estabilidade emocional. São parceiros seguros e consistentes."}
                  {userData.favoriteColor === 'Verde' && "Quem gosta de verde valoriza harmonia, crescimento e relacionamentos equilibrados. São naturalmente fiéis e buscam paz."}
                  {userData.favoriteColor === 'Vermelho' && "Amantes do vermelho são apaixonados e intensos, mas podem ser impulsivos. Sua fidelidade depende da intensidade da paixão."}
                  {userData.favoriteColor === 'Amarelo' && "Pessoas que preferem amarelo são otimistas, mas podem ter dificuldade com compromissos longos. Precisam de estímulo constante."}
                  {userData.favoriteColor === 'Rosa' && "Quem gosta de rosa é romântico e carinhoso, valorizando relacionamentos afetivos. Tendem a ser fiéis por natureza."}
                  {userData.favoriteColor === 'Roxo' && "Amantes do roxo são criativos e misteriosos, buscando conexões profundas. Sua fidelidade é intensa quando comprometidos."}
                  {userData.favoriteColor === 'Laranja' && "Pessoas que preferem laranja são sociáveis e energéticas, mas podem ser inconstantes. Precisam de variedade no relacionamento."}
                  {userData.favoriteColor === 'Preto' && "Quem gosta de preto é elegante e reservado, mas pode ser emocionalmente distante. Sua fidelidade é profunda mas silenciosa."}
                  {userData.favoriteColor === 'Branco' && "Amantes do branco buscam pureza e simplicidade nos relacionamentos. São naturalmente fiéis e honestos."}
                  {userData.favoriteColor === 'Cinza' && "Pessoas que preferem cinza são equilibradas e práticas em relacionamentos. Sua fidelidade é estável e duradoura."}
                  {userData.favoriteColor === 'Marrom' && "Quem gosta de marrom valoriza estabilidade, segurança e tradição. São parceiros extremamente confiáveis."}
                  {userData.favoriteColor === 'Dourado' && "Amantes do dourado buscam luxo e reconhecimento, mas podem ser leais quando encontram alguém que os valorize."}
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
                <h4 className="font-bold text-gray-800 mb-4">💡 Dicas Personalizadas para Melhorar o Relacionamento</h4>
                <div className="space-y-3 text-sm text-gray-700">
                  {score.percentage >= 80 && (
                    <>
                      <p className="font-semibold text-green-700">✅ Parabéns! Seu relacionamento mostra sinais muito positivos.</p>
                      <ul className="space-y-1 ml-4">
                        <li>• Continue cultivando a comunicação aberta</li>
                        <li>• Mantenha a confiança mútua</li>
                        <li>• Celebrem juntos as conquistas do relacionamento</li>
                      </ul>
                    </>
                  )}
                  {score.percentage >= 60 && score.percentage < 80 && (
                    <>
                      <p className="font-semibold text-yellow-700">⚠️ Boa base, mas algumas áreas precisam de atenção.</p>
                      <ul className="space-y-1 ml-4">
                        <li>• Tenham conversas mais profundas sobre expectativas</li>
                        <li>• Trabalhem na transparência mútua</li>
                        <li>• Dediquem mais tempo de qualidade juntos</li>
                      </ul>
                    </>
                  )}
                  {score.percentage >= 40 && score.percentage < 60 && (
                    <>
                      <p className="font-semibold text-orange-700">🚨 Alguns sinais de alerta detectados.</p>
                      <ul className="space-y-1 ml-4">
                        <li>• Conversem abertamente sobre inseguranças</li>
                        <li>• Estabeleçam limites claros no relacionamento</li>
                        <li>• Considerem terapia de casal se necessário</li>
                      </ul>
                    </>
                  )}
                  {score.percentage < 40 && (
                    <>
                      <p className="font-semibold text-red-700">🔴 Pontos de preocupação identificados.</p>
                      <ul className="space-y-1 ml-4">
                        <li>• Tenham uma conversa franca sobre o futuro</li>
                        <li>• Avaliem se os valores estão alinhados</li>
                        <li>• Considerem se o relacionamento está saudável</li>
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500 mt-8 pt-6 border-t border-gray-200">
              <p>Este relatório foi gerado com base em análise comportamental, astrológica e psicológica para fins de entretenimento.</p>
              <p className="mt-2">Data: {new Date().toLocaleDateString('pt-BR')} | Relatório personalizado para {userData.partnerName}</p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 max-w-md mx-auto">
            <button
              onClick={generateReport}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Baixar Relatório PDF
            </button>

            <button
              onClick={() => {
                setStep('intro')
                setCurrentQuestion(0)
                setAnswers([])
                setUserData({ partnerName: '', age: 0, hisSign: '', herSign: '', favoriteColor: '' })
                setIsPaid(false)
                setPaymentProcessing(false)
              }}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Fazer Novo Teste
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            Compartilhe este teste com suas amigas e descubram juntas a verdade sobre seus relacionamentos! ✨
          </p>
        </div>
      </div>
    )
  }

  return null
}