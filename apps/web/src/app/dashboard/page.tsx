'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Tag, 
  Package, 
  Rocket, 
  Briefcase, 
  Heart, 
  Power,
  Bell,
  Plus,
  Phone,
  Calendar,
  X,
  Send,
  Sparkles,
  Trash2,
  Edit,
  Save,
  Image as ImageIcon,
  DollarSign,
  Upload,
  Settings,
  UserPlus,
  FileText,
  Globe,
  Bot,
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from 'lucide-react'
import { siteData as initialSiteData } from '@/lib/site-data'

// --- Types ---
interface Customer {
  id: number;
  name: string;
  phone: string;
  projectDetails: string;
  orderDate: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

interface Supplier {
  id: number;
  companyName: string;
  contactPerson: string;
  phone: string;
  orderDetails: string;
  orderDate: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
}

interface MarketingEmployee {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: any;
  color: string;
}

const marketingEmployees: MarketingEmployee[] = [
  {
    id: 'creative',
    name: 'المبدع',
    role: 'مصمم جرافيك',
    description: 'أنا متخصص في تصميم المواد التسويقية المبهجة',
    icon: Sparkles,
    color: 'text-pink-500'
  },
  {
    id: 'copywriter',
    name: 'الكاتب',
    role: 'مكتوب محتوى',
    description: 'أنا صاحب الإبداع الكتابي ومحفّزات جذابة',
    icon: FileText,
    color: 'text-blue-500'
  },
  {
    id: 'strategist',
    name: 'المخطط',
    role: 'مخطط استراتيجي',
    description: 'أنا أضع الخطة التسويقية المناسبة لك',
    icon: Globe,
    color: 'text-green-500'
  }
];

const menuItems = [
  { id: 'orders', name: 'طلبات العملاء', icon: FileText, ai: false },
  { id: 'stats', name: 'احصائيات المنصة', icon: TrendingUp, ai: false },
  { id: 'customers', name: 'سيستم العملاء', icon: Users, ai: false },
  { id: 'suppliers', name: 'سيستم المورّدين', icon: Building2, ai: false },
  { id: 'categories', name: 'الأقسام', icon: Tag, ai: false },
  { id: 'products', name: 'المنتجات', icon: Package, ai: false },
  { id: 'marketing', name: 'مركز التسويق', icon: Rocket, ai: true },
  { id: 'portfolio', name: 'إدارة الأعمال', icon: Briefcase, ai: false },
  { id: 'partners', name: 'شركاء النجاح', icon: Heart, ai: false },
];

export default function DashboardPage() {
  const [currentTab, setCurrentTab] = useState('stats')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [siteData, setSiteData] = useState(initialSiteData)
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    whatsapp: '',
    google: '',
    facebook: '',
    stripe: ''
  })
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [showEditCustomer, setShowEditCustomer] = useState(false)
  const [showAddSupplier, setShowAddSupplier] = useState(false)
  const [showEditSupplier, setShowEditSupplier] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showEditCategory, setShowEditCategory] = useState<any>(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showEditProduct, setShowEditProduct] = useState<any>(null)
  const [showAddPortfolio, setShowAddPortfolio] = useState(false)
  const [showEditPortfolio, setShowEditPortfolio] = useState<any>(null)
  const [showAddPartner, setShowAddPartner] = useState(false)
  const [showEditPartner, setShowEditPartner] = useState<any>(null)
  const [activeMarketingEmployee, setActiveMarketingEmployee] = useState<string>('')
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const router = useRouter()

  // --- State for Forms ---
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({})
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer>>({})
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({})
  const [editingSupplier, setEditingSupplier] = useState<Partial<Supplier>>({})
  const [newCategory, setNewCategory] = useState<Partial<{ id: number; name: string; image: string }>>({})
  const [editCategoryForm, setEditCategoryForm] = useState<any>(null)
  const [newProduct, setNewProduct] = useState<Partial<{
    id: number; name: string; price: number; category: string; description: string; image: string;
    width: number; height: number; unit: 'm' | 'cm';
    pricingType: 'meter' | 'piece' | 'letter';
  }>>({})
  const [editProductForm, setEditProductForm] = useState<any>(null)
  const [newPortfolio, setNewPortfolio] = useState<Partial<{ id: number; title: string; category: string; description: string; image: string }>>({})
  const [editPortfolioForm, setEditPortfolioForm] = useState<any>(null)
  const [newPartner, setNewPartner] = useState<Partial<{ id: number; name: string; logo: string }>>({})
  const [editPartnerForm, setEditPartnerForm] = useState<any>(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }

    const user = JSON.parse(userStr)
    if (user.role !== 'admin') {
      // Not admin, redirect to homepage
      router.push('/')
      return
    }

    // --- Load Saved Data from Database First ---
    const loadData = async () => {
      try {
        const res = await fetch('/api/site-data')
        const data = await res.json()
        setSiteData(data)
        // Also sync to localStorage
        localStorage.setItem('albahrawy_site_data', JSON.stringify(data))
      } catch (error) {
        console.error('Error loading data from server, falling back to localStorage:', error)
        // --- Fallback to Saved Data ---
        const storedData = localStorage.getItem('albahrawy_site_data')
        if (storedData) setSiteData(JSON.parse(storedData))
      }
    }
    loadData()

    // --- Load API Keys ---
    const storedApiKeys = localStorage.getItem('albahrawy_api_keys')
    if (storedApiKeys) setApiKeys(JSON.parse(storedApiKeys))

    setIsLoggedIn(true)
    setLoading(false)
  }, [])

  // --- Save Helpers ---
  const saveSiteData = async (newData: any) => {
    setSiteData(newData)
    localStorage.setItem('albahrawy_site_data', JSON.stringify(newData))
    
    // Save to server for online persistence
    try {
      const response = await fetch('/api/site-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      })
      if (!response.ok) {
        throw new Error('Failed to save to server')
      }
      console.log('Site data saved to server successfully')
    } catch (error) {
      console.error('Error saving site data to server:', error)
    }
  }



  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  // --- Handlers ---
  const addCustomer = () => {
    const customer: Customer = {
      id: Date.now(),
      name: newCustomer.name || '',
      phone: newCustomer.phone || '',
      projectDetails: newCustomer.projectDetails || '',
      orderDate: new Date().toISOString().split('T')[0],
      totalAmount: newCustomer.totalAmount || 0,
      paidAmount: newCustomer.paidAmount || 0,
      remainingAmount: (newCustomer.totalAmount || 0) - (newCustomer.paidAmount || 0),
      status: 'pending'
    }
    saveSiteData({ ...siteData, customers: [customer, ...(siteData.customers || [])]})
    setNewCustomer({})
    setShowAddCustomer(false)
  }

  const deleteCustomer = (id: number) => {
    saveSiteData({ ...siteData, customers: (siteData.customers || []).filter(c => c.id !== id)})
  }

  const updateCustomer = (id: number, data: Partial<Customer>) => {
    const updatedCustomers = (siteData.customers || []).map(c => {
      if (c.id === id) {
        const updated = { ...c, ...data }
        if (data.totalAmount !== undefined || data.paidAmount !== undefined) {
          updated.remainingAmount = (updated.totalAmount || 0) - (updated.paidAmount || 0)
        }
        return updated
      }
      return c
    })
    saveSiteData({ ...siteData, customers: updatedCustomers})
    setShowEditCustomer(false)
    setEditingCustomer({})
  }

  const addSupplier = () => {
    const supplier: Supplier = {
      id: Date.now(),
      companyName: newSupplier.companyName || '',
      contactPerson: newSupplier.contactPerson || '',
      phone: newSupplier.phone || '',
      orderDetails: newSupplier.orderDetails || '',
      orderDate: new Date().toISOString().split('T')[0],
      totalAmount: newSupplier.totalAmount || 0,
      paidAmount: newSupplier.paidAmount || 0,
      remainingAmount: (newSupplier.totalAmount || 0) - (newSupplier.paidAmount || 0)
    }
    saveSiteData({ ...siteData, suppliers: [supplier, ...(siteData.suppliers || [])]})
    setNewSupplier({})
    setShowAddSupplier(false)
  }

  const deleteSupplier = (id: number) => {
    saveSiteData({ ...siteData, suppliers: (siteData.suppliers || []).filter(s => s.id !== id)})
  }

  const updateSupplier = (id: number, data: Partial<Supplier>) => {
    const updatedSuppliers = (siteData.suppliers || []).map(s => {
      if (s.id === id) {
        const updated = { ...s, ...data }
        if (data.totalAmount !== undefined || data.paidAmount !== undefined) {
          updated.remainingAmount = (updated.totalAmount || 0) - (updated.paidAmount || 0)
        }
        return updated
      }
      return s
    })
    saveSiteData({ ...siteData, suppliers: updatedSuppliers})
    setShowEditSupplier(false)
    setEditingSupplier({})
  }

  const sendMessage = async () => {
    if (!chatInput.trim()) return
    setChatMessages([...chatMessages, { role: 'user', text: chatInput }])
    const userText = chatInput
    setChatInput('')

    // Get the selected employee to know their role
    const emp = marketingEmployees.find(e => e.id === activeMarketingEmployee)
    const systemPrompt = `أنت ${emp?.name}, ${emp?.role} في شركة البحراوي للإعلانات. ${emp?.description}. أجب باللغة العربية فقط وكن مبدع ومفيد ومختصر.`

    // Check if we have the OpenAI API key
    if (!apiKeys.openai || apiKeys.openai.trim() === '') {
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          text: 'يرجى إضافة مفتاح OpenAI API في قسم إعدادات APIs أولًا!'
        }])
      }, 500)
      return
    }

    try {
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKeys.openai}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...chatMessages.map(m => ({ role: m.role, content: m.text })),
            { role: 'user', content: userText }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      })

      let errorDetails = ''
      if (!response.ok) {
        try {
          const errorData = await response.json()
          errorDetails = errorData.error?.message || `HTTP Error: ${response.status}`
        } catch (e) {
          errorDetails = `HTTP Error: ${response.status}`
        }
        throw new Error(errorDetails)
      }

      const data = await response.json()
      const aiResponse = data.choices[0]?.message?.content || 'آسف، لم أتمكن من الحصول على رد!'

      setChatMessages(prev => [...prev, {
        role: 'assistant',
        text: aiResponse
      }])

    } catch (error: any) {
      console.error('OpenAI API Error:', error)
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          text: `خطأ! ${error?.message || 'تأكد من صحة مفتاح API واتصال الإنترنت!'}`
        }])
      }, 500)
    }
  }

  // --- Image Handler ---
  const handleImageUpload = (e: any, setFunc: any) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFunc(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) return null

  // --- Stats Helpers ---
  const totalRevenue = (siteData.customers || []).reduce((sum, c) => sum + (c.paidAmount || 0), 0)
  const pendingAmount = (siteData.customers || []).reduce((sum, c) => sum + (c.remainingAmount || 0), 0)
  const activeProjects = (siteData.customers || []).filter(c => c.status === 'in_progress').length

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-cairo">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#0F0F0F] border-l border-white/5 flex flex-col z-[100]">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-[#FFD700] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FFD700]/20">
              <Sparkles className="text-black w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter leading-tight">ALBAHRAWY <span className="text-[#FFD700]">OS</span></h1>
              <p className="text-[10px] text-[#FFD700]/60 font-bold uppercase tracking-[0.2em]">ENTERPRISE ENGINE</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                  currentTab === item.id
                    ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-black shadow-lg shadow-[#FFD700]/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-[#FFD700]'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${currentTab === item.id ? 'text-black' : ''}`} />
                <span className="text-sm font-bold">{item.name}</span>
                {item.ai && (
                  <span className={`mr-auto text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest shadow-sm ${
                    currentTab === item.id ? 'bg-black/20 text-black' : 'bg-[#FFD700] text-black'
                  }`}>AI</span>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/5">
          <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-3xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFD700] flex items-center justify-center font-black text-black">CEO</div>
            <div className="flex-1 text-right">
              <p className="text-xs font-black">محمد البحراوي</p>
              <p className="text-[10px] text-[#FFD700]/60 font-bold">المدير التنفيذي</p>
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition">
              <Power className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,0.03),transparent)] pointer-events-none" />
        
        {/* Header */}
        <header className="bg-black/50 backdrop-blur-2xl border-b border-white/5 px-10 py-6 flex justify-between items-center sticky top-0 z-50">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              {menuItems.find(m => m.id === currentTab)?.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 rounded-2xl border border-white/5 flex items-center justify-center hover:bg-[#1A1A1A] hover:border-[#FFD700] transition-all relative group">
              <Bell className="w-5 h-5 text-gray-400 group-hover:text-[#FFD700]" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-[#FFD700] rounded-full shadow-lg shadow-[#FFD700]/50" />
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          
          {/* 0: Orders Page */}
          {currentTab === 'orders' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="bg-[#0F0F0F] border border-white/5 px-6 py-4 rounded-3xl flex items-center gap-4">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">الطلبات</p>
                    <p className="text-2xl font-black text-[#FFD700]">{siteData.orders?.length || 0}</p>
                  </div>
                  <div className="bg-[#0F0F0F] border border-white/5 px-6 py-4 rounded-3xl flex items-center gap-4">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">قيد المراجعة</p>
                    <p className="text-2xl font-black text-yellow-500">
                      {siteData.orders?.filter((o: any) => o.status === 'pending').length || 0}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    // Add a test order
                    const newOrder = {
                      id: Date.now(),
                      name: 'عميل تجريبي',
                      phone: '01001234567',
                      projectDetails: 'طلب تجريبي للاختبار',
                      source: 'whatsapp',
                      status: 'pending',
                      createdAt: new Date().toISOString(),
                    }
                    const updatedData = {
                      ...siteData,
                      orders: [...siteData.orders, newOrder],
                    }
                    saveSiteData(updatedData)
                  }}
                  className="bg-[#FFD700] text-black px-8 py-4 rounded-2xl font-black shadow-xl shadow-[#FFD700]/20 flex items-center gap-3"
                >
                  <Plus className="w-5 h-5" /> إضافة طلب تجريبي
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {!siteData.orders || siteData.orders.length === 0 ? (
                  <div className="bg-[#0F0F0F] border border-white/5 rounded-[2.5rem] p-10 flex items-center justify-center min-h-[300px]">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-400">لا توجد طلبات بعد</h3>
                    </div>
                  </div>
                ) : (
                  siteData.orders?.map((order: any) => (
                    <div key={order.id} className="bg-[#0F0F0F] border border-white/5 rounded-[2.5rem] p-8 hover:border-[#FFD700]/30 transition-all group">
                      <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-4">
                            <h3 className="text-2xl font-black text-white">{order.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                              order.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                              order.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                              'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            }`}>
                              {order.status === 'pending' ? 'قيد المراجعة' :
                               order.status === 'in_progress' ? 'جاري التنفيذ' :
                               order.status === 'completed' ? 'مكتمل' : 'ملغى'}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold border bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/20">
                              {order.source === 'website' ? 'من الموقع' : 'من واتساب'}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                              <Phone className="w-4 h-4 text-[#FFD700]" /> 
                              <input 
                                value={order.phone} 
                                onChange={(e) => {
                                  const updatedOrders = siteData.orders.map((o: any) => 
                                    o.id === order.id ? { ...o, phone: e.target.value } : o
                                  )
                                  saveSiteData({ ...siteData, orders: updatedOrders })
                                }} 
                                className="bg-transparent focus:outline-none border-b border-transparent focus:border-[#FFD700]" 
                              />
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <Calendar className="w-4 h-4 text-[#FFD700]" /> 
                              {new Date(order.createdAt).toLocaleDateString('ar-EG', { 
                                year: 'numeric', month: 'long', day: 'numeric', 
                                hour: '2-digit', minute: '2-digit' 
                              })}
                            </div>
                          </div>
                          <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                            <textarea 
                              value={order.projectDetails} 
                              onChange={(e) => {
                                const updatedOrders = siteData.orders.map((o: any) => 
                                  o.id === order.id ? { ...o, projectDetails: e.target.value } : o
                                )
                                saveSiteData({ ...siteData, orders: updatedOrders })
                              }} 
                              placeholder="تفاصيل الطلب" 
                              className="w-full bg-transparent focus:outline-none text-sm resize-none"
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 min-w-[180px]">
                          <select 
                            value={order.status} 
                            onChange={(e) => {
                              const updatedOrders = siteData.orders.map((o: any) => 
                                o.id === order.id ? { ...o, status: e.target.value as any } : o
                              )
                              saveSiteData({ ...siteData, orders: updatedOrders })
                            }} 
                            className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FFD700]"
                          >
                            <option value="pending">قيد المراجعة</option>
                            <option value="in_progress">جاري التنفيذ</option>
                            <option value="completed">مكتمل</option>
                            <option value="cancelled">ملغى</option>
                          </select>
                          <button 
                            onClick={() => {
                              const updatedOrders = siteData.orders.filter((o: any) => o.id !== order.id)
                              saveSiteData({ ...siteData, orders: updatedOrders })
                            }}
                            className="px-4 py-3 rounded-xl border border-red-500/30 text-red-500 text-sm font-bold hover:bg-red-500/10 transition"
                          >
                            <Trash2 className="w-4 h-4 inline mr-2" /> حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* 1: Stats Page */}
          {currentTab === 'stats' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'إجمالي الإيرادات', value: `${totalRevenue.toLocaleString()} ج.م`, trend: '+15%', up: true, icon: TrendingUp, color: 'text-green-500' },
                  { label: 'المبالغ المتبقية', value: `${pendingAmount.toLocaleString()} ج.م`, trend: '-2%', up: false, icon: DollarSign, color: 'text-red-500' },
                  { label: 'عدد العملاء', value: (siteData.customers || []).length, trend: '+5', up: true, icon: Users, color: 'text-blue-500' },
                  { label: 'المشاريع النشطة', value: activeProjects, trend: 'جاري', up: true, icon: Briefcase, color: 'text-purple-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#0F0F0F] border border-white/5 rounded-3xl p-8 group relative overflow-hidden hover:border-[#FFD700]/40 transition-all duration-500 hover:-translate-y-1">
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#FFD700]/5 rounded-full blur-3xl group-hover:bg-[#FFD700]/10 transition-all duration-700" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="p-3 bg-white/5 rounded-xl group-hover:bg-[#FFD700]/10 transition">
                        <stat.icon className="w-6 h-6 text-[#FFD700]" />
                      </div>
                      <span className={`text-[10px] font-black flex items-center gap-1 ${stat.up ? 'text-green-500' : 'text-red-500'}`}>{stat.trend}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-bold mb-1 relative z-10">{stat.label}</p>
                    <h3 className="text-3xl font-black text-white tracking-tighter relative z-10">{stat.value}</h3>
                  </div>
                ))}
              </div>
              <div className="bg-[#0F0F0F] border border-white/5 rounded-[2.5rem] p-10 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-400">الرسوم البيانية قيد التنفيذ</h3>
                </div>
              </div>
            </div>
          )}

          {/* 2: Customers Module */}
          {currentTab === 'customers' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="bg-[#0F0F0F] border border-white/5 px-6 py-4 rounded-3xl flex items-center gap-4">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">العملاء</p>
                    <p className="text-2xl font-black text-[#FFD700]">{(siteData.customers || []).length}</p>
                  </div>
                </div>
                <button onClick={() => setShowAddCustomer(true)} className="bg-[#FFD700] text-black px-8 py-4 rounded-2xl font-black shadow-xl shadow-[#FFD700]/20 flex items-center gap-3">
                  <UserPlus className="w-5 h-5" /> إضافة عميل
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {(siteData.customers || []).map(customer => (
                  <div key={customer.id} className="bg-[#0F0F0F] border border-white/5 rounded-[2.5rem] p-8 hover:border-[#FFD700]/30 transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                          <h3 className="text-2xl font-black text-white">{customer.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            customer.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            customer.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                            'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                          }`}>
                            {customer.status === 'pending' ? 'قيد المراجعة' :
                             customer.status === 'in_progress' ? 'جاري التنفيذ' :
                             customer.status === 'completed' ? 'مكتمل' : 'ملغى'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-400"><Phone className="w-4 h-4 text-[#FFD700]" /> <input value={customer.phone} onChange={(e) => updateCustomer(customer.id, { phone: e.target.value })} className="bg-transparent focus:outline-none border-b border-transparent focus:border-[#FFD700]" /></div>
                          <div className="flex items-center gap-2 text-gray-400"><Calendar className="w-4 h-4 text-[#FFD700]" /> <input value={customer.orderDate} onChange={(e) => updateCustomer(customer.id, { orderDate: e.target.value })} className="bg-transparent focus:outline-none border-b border-transparent focus:border-[#FFD700]" /></div>
                          <div className="flex items-center gap-2 text-gray-400"><DollarSign className="w-4 h-4 text-green-500" /> المدفوع: <input type="number" value={customer.paidAmount} onChange={(e) => updateCustomer(customer.id, { paidAmount: Number(e.target.value) })} className="bg-transparent w-24 text-green-500 font-bold focus:outline-none border-b border-transparent focus:border-green-500" /> ج.م</div>
                          <div className="flex items-center gap-2 text-gray-400"><TrendingUp className="w-4 h-4 text-red-500" /> المتبقي: <span className="text-red-500 font-bold">{customer.remainingAmount.toLocaleString()}</span> ج.م</div>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                          <input value={customer.projectDetails} onChange={(e) => updateCustomer(customer.id, { projectDetails: e.target.value })} placeholder="تفاصيل الطلب" className="w-full bg-transparent focus:outline-none text-sm" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 min-w-[180px]">
                        <select value={customer.status} onChange={(e) => updateCustomer(customer.id, { status: e.target.value as any })} className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FFD700]">
                          <option value="pending">قيد المراجعة</option>
                          <option value="in_progress">جاري التنفيذ</option>
                          <option value="completed">مكتمل</option>
                          <option value="cancelled">ملغى</option>
                        </select>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-black/60 border border-white/10 rounded-xl p-2">
                            <label className="text-[10px] text-gray-500">الإجمالي</label>
                            <input type="number" value={customer.totalAmount} onChange={(e) => updateCustomer(customer.id, { totalAmount: Number(e.target.value) })} className="w-full bg-transparent text-center font-bold" />
                          </div>
                        </div>
                        <button onClick={() => deleteCustomer(customer.id)} className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                        <button onClick={() => {
                          setEditingCustomer(customer as Partial<Customer>)
                          setShowEditCustomer(true)
                        }} className="bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] px-4 py-2 rounded-xl hover:bg-[#FFD700] hover:text-black transition-all">
                          <Edit className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {(siteData.customers || []).length === 0 && <div className="text-center py-32 text-gray-500">لا يوجد عملاء بعد، اضف أول عميل</div>}
              </div>
            </div>
          )}

          {/* 3: Suppliers Module */}
          {currentTab === 'suppliers' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="bg-[#0F0F0F] border border-white/5 px-6 py-4 rounded-3xl flex items-center gap-4">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">المورّدين</p>
                    <p className="text-2xl font-black text-[#FFD700]">{(siteData.suppliers || []).length}</p>
                  </div>
                </div>
                <button onClick={() => setShowAddSupplier(true)} className="bg-[#FFD700] text-black px-8 py-4 rounded-2xl font-black shadow-xl shadow-[#FFD700]/20 flex items-center gap-3">
                  <Building2 className="w-5 h-5" /> إضافة مورّد
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {(siteData.suppliers || []).map(supplier => (
                  <div key={supplier.id} className="bg-[#0F0F0F] border border-white/5 rounded-[2.5rem] p-8 hover:border-[#FFD700]/30 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                          <h3 className="text-2xl font-black text-white">{supplier.companyName}</h3>
                          <p className="text-gray-400 text-sm">المسؤول: {supplier.contactPerson}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-400"><Phone className="w-4 h-4 text-[#FFD700]" /> <input value={supplier.phone} onChange={(e) => updateSupplier(supplier.id, { phone: e.target.value })} className="bg-transparent focus:outline-none border-b border-transparent focus:border-[#FFD700]" /></div>
                          <div className="flex items-center gap-2 text-gray-400"><Calendar className="w-4 h-4 text-[#FFD700]" /> <input value={supplier.orderDate} onChange={(e) => updateSupplier(supplier.id, { orderDate: e.target.value })} className="bg-transparent focus:outline-none border-b border-transparent focus:border-[#FFD700]" /></div>
                          <div className="flex items-center gap-2 text-gray-400"><DollarSign className="w-4 h-4 text-green-500" /> دفعنا: <input type="number" value={supplier.paidAmount} onChange={(e) => updateSupplier(supplier.id, { paidAmount: Number(e.target.value) })} className="bg-transparent w-24 text-green-500 font-bold focus:outline-none border-b border-transparent focus:border-green-500" /> ج.م</div>
                          <div className="flex items-center gap-2 text-gray-400"><TrendingUp className="w-4 h-4 text-orange-500" /> باقي: <span className="text-orange-500 font-bold">{supplier.remainingAmount.toLocaleString()}</span> ج.م</div>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                          <input value={supplier.orderDetails} onChange={(e) => updateSupplier(supplier.id, { orderDetails: e.target.value })} placeholder="طلبنا منهم" className="w-full bg-transparent focus:outline-none text-sm" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 min-w-[180px]">
                        <div className="flex gap-2">
                          <div className="flex-1 bg-black/60 border border-white/10 rounded-xl p-2">
                            <label className="text-[10px] text-gray-500">الإجمالي</label>
                            <input type="number" value={supplier.totalAmount} onChange={(e) => updateSupplier(supplier.id, { totalAmount: Number(e.target.value) })} className="w-full bg-transparent text-center font-bold" />
                          </div>
                        </div>
                        <button onClick={() => deleteSupplier(supplier.id)} className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                        <button onClick={() => {
                          setEditingSupplier(supplier)
                          setShowEditSupplier(true)
                        }} className="bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] px-4 py-2 rounded-xl hover:bg-[#FFD700] hover:text-black transition-all">
                          <Edit className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {(siteData.suppliers || []).length === 0 && <div className="text-center py-32 text-gray-500">لا يوجد مورّدين بعد</div>}
              </div>
            </div>
          )}

          {/* 4: Categories Module */}
          {currentTab === 'categories' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#FFD700]">إدارة الأقسام</h3>
                <button onClick={() => {
                  setNewCategory({})
                  setShowAddCategory(true)
                }} className="bg-[#FFD700] text-black px-6 py-3 rounded-2xl font-black flex items-center gap-3">
                  <Plus className="w-5 h-5" /> إضافة قسم
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {siteData.categories.map(cat => (
                  <div key={cat.id} className="bg-[#0F0F0F] border border-white/5 rounded-[2rem] overflow-hidden group">
                    <div className="h-40 relative">
                      <img src={cat.image} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => {
                          setEditCategoryForm(cat)
                          setShowEditCategory(true)
                        }} className="w-10 h-10 bg-[#FFD700] text-black rounded-full flex items-center justify-center hover:scale-110 transition">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => {
                          const newCats = siteData.categories.filter(c => c.id !== cat.id)
                          saveSiteData({ ...siteData, categories: newCats })
                        }} className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-white">{cat.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5: Products Module */}
          {currentTab === 'products' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#FFD700]">إدارة المنتجات</h3>
                <button onClick={() => {
                  setNewProduct({})
                  setShowAddProduct(true)
                }} className="bg-[#FFD700] text-black px-6 py-3 rounded-2xl font-black flex items-center gap-3">
                  <Plus className="w-5 h-5" /> إضافة منتج
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {siteData.products.map(product => (
                  <div key={product.id} className="bg-[#0F0F0F] border border-white/5 rounded-[2rem] overflow-hidden hover:border-[#FFD700]/30 transition-all group">
                    <div className="h-48 relative">
                      <img src={product.image} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => {
                          setEditProductForm(product)
                          setShowEditProduct(true)
                        }} className="w-10 h-10 bg-[#FFD700] text-black rounded-full flex items-center justify-center hover:scale-110 transition">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => {
                          const newProds = siteData.products.filter(p => p.id !== product.id)
                          saveSiteData({ ...siteData, products: newProds })
                        }} className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <h4 className="text-xl font-black text-white">{product.name}</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#FFD700] font-bold">
                          {product.price.toLocaleString()} ج.م / {product.pricingType === 'piece' ? 'القطعة' : product.pricingType === 'meter' ? 'المتر' : 'الحرف'}
                        </span>
                        {product.width && <span className="text-gray-400">{product.width} × {product.height} {product.unit}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6: Marketing Center */}
          {currentTab === 'marketing' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* API Key Section */}
              <div className="bg-[#0F0F0F] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                  <Settings className="text-[#FFD700]" /> إعدادات APIs القوية
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* OpenAI API */}
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white text-2xl">
                        <i className="fas fa-robot"></i>
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-white">OpenAI API</h4>
                        <p className="text-xs text-gray-400">للمساعدات الذكية والمحتوى</p>
                      </div>
                    </div>
                    <input
                      type="password"
                      placeholder="sk-proj-xxxxxxxxxxxxxxxxxxxx"
                      value={apiKeys.openai}
                      onChange={(e) => {
                        const newKeys = { ...apiKeys, openai: e.target.value }
                        setApiKeys(newKeys)
                        localStorage.setItem('albahrawy_api_keys', JSON.stringify(newKeys))
                      }}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFD700] text-sm"
                    />
                    <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] text-xs hover:underline">احصل على مفتاح من هنا →</a>
                  </div>

                  {/* WhatsApp Cloud API */}
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl">
                        <i className="fab fa-whatsapp"></i>
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-white">WhatsApp Business API</h4>
                        <p className="text-xs text-gray-400">لإرسال رسائل للعملاء</p>
                      </div>
                    </div>
                    <input
                      type="password"
                      placeholder="EAAxxxxxxxxxxxxxxxx"
                      value={apiKeys.whatsapp}
                      onChange={(e) => {
                        const newKeys = { ...apiKeys, whatsapp: e.target.value }
                        setApiKeys(newKeys)
                        localStorage.setItem('albahrawy_api_keys', JSON.stringify(newKeys))
                      }}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFD700] text-sm"
                    />
                    <a href="https://developers.facebook.com/docs/whatsapp/cloud-api" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] text-xs hover:underline">احصل على مفتاح من هنا →</a>
                  </div>

                  {/* Google API */}
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-2xl">
                        <i className="fab fa-google"></i>
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-white">Google APIs</h4>
                        <p className="text-xs text-gray-400">للتحليلات والخرائط</p>
                      </div>
                    </div>
                    <input
                      type="password"
                      placeholder="AIzaxxxxxxxxxxxxxxxxx"
                      value={apiKeys.google}
                      onChange={(e) => {
                        const newKeys = { ...apiKeys, google: e.target.value }
                        setApiKeys(newKeys)
                        localStorage.setItem('albahrawy_api_keys', JSON.stringify(newKeys))
                      }}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFD700] text-sm"
                    />
                    <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] text-xs hover:underline">احصل على مفتاح من هنا →</a>
                  </div>

                  {/* Facebook Graph API */}
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white text-2xl">
                        <i className="fab fa-facebook-f"></i>
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-white">Facebook Graph API</h4>
                        <p className="text-xs text-gray-400">لإدارة صفحاتك</p>
                      </div>
                    </div>
                    <input
                      type="password"
                      placeholder="EAAxxxxxxxxxxxxxxxx"
                      value={apiKeys.facebook}
                      onChange={(e) => {
                        const newKeys = { ...apiKeys, facebook: e.target.value }
                        setApiKeys(newKeys)
                        localStorage.setItem('albahrawy_api_keys', JSON.stringify(newKeys))
                      }}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFD700] text-sm"
                    />
                    <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] text-xs hover:underline">احصل على مفتاح من هنا →</a>
                  </div>

                  {/* Stripe API */}
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4 md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white text-2xl">
                        <i className="fab fa-stripe-s"></i>
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-white">Stripe API</h4>
                        <p className="text-xs text-gray-400">لقبول الدفع الإلكتروني</p>
                      </div>
                    </div>
                    <input
                      type="password"
                      placeholder="sk_live_xxxxxxxxxxxxxxxx"
                      value={apiKeys.stripe}
                      onChange={(e) => {
                        const newKeys = { ...apiKeys, stripe: e.target.value }
                        setApiKeys(newKeys)
                        localStorage.setItem('albahrawy_api_keys', JSON.stringify(newKeys))
                      }}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFD700] text-sm"
                    />
                    <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] text-xs hover:underline">احصل على مفتاح من هنا →</a>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    localStorage.setItem('albahrawy_api_keys', JSON.stringify(apiKeys))
                    alert('تم حفظ جميع المفاتيح بنجاح! ✨')
                  }}
                  className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black py-5 rounded-2xl font-black text-xl shadow-xl hover:shadow-[#FFD700]/30 transition hover:scale-[1.01]"
                >
                  <Save className="w-6 h-6 inline-block mr-3" /> حفظ جميع المفاتيح
                </button>
              </div>

              {/* Social Links */}
              <div className="bg-[#0F0F0F] border border-white/5 rounded-[2.5rem] p-8">
                <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                  <Globe className="text-[#FFD700]" /> ربط الصفحات
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'فيسبوك', icon: Facebook, color: 'text-blue-500' },
                    { name: 'إنستجرام', icon: Instagram, color: 'text-pink-500' },
                    { name: 'تويتر', icon: Twitter, color: 'text-blue-400' },
                    { name: 'يوتيوب', icon: Youtube, color: 'text-red-500' },
                  ].map((social, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-black/40 border border-white/10 rounded-2xl">
                      <social.icon className={`w-6 h-6 ${social.color}`} />
                      <span className="font-bold min-w-[100px]">{social.name}</span>
                      <input type="text" placeholder="https://" className="flex-1 bg-transparent border-b border-white/10 text-sm focus:outline-none focus:border-[#FFD700]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Employees */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                  <h3 className="text-xl font-bold text-white mb-6">الموظفين AI</h3>
                  {marketingEmployees.map(emp => (
                    <div
                      key={emp.id}
                      onClick={() => {
                        setActiveMarketingEmployee(emp.id)
                        setChatMessages([{ role: 'assistant', text: `مرحباً! أنا ${emp.name}، ${emp.role}. كيف يمكنني مساعدتك؟` }])
                      }}
                      className={`p-6 bg-[#0F0F0F] border-2 rounded-2xl cursor-pointer transition-all hover:border-[#FFD700]/50 ${
                        activeMarketingEmployee === emp.id ? 'border-[#FFD700] shadow-[#FFD700]/20' : 'border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 bg-white/10 rounded-full flex items-center justify-center ${emp.color}`}>
                          <emp.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-black">{emp.name}</h4>
                          <p className="text-xs text-gray-500">{emp.role}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{emp.description}</p>
                    </div>
                  ))}
                </div>

                {/* Chat Interface */}
                <div className="lg:col-span-2 bg-[#0F0F0F] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col">
                  {!activeMarketingEmployee ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-10">
                      <Bot className="w-16 h-16 mb-4 opacity-30" />
                      <p>اختر موظف AI للبدء في المحادثة</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-black/30">
                        {(() => {
                          const emp = marketingEmployees.find(e => e.id === activeMarketingEmployee)!
                          return (
                            <>
                              <div className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center ${emp.color}`}>
                                <emp.icon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-bold">{emp.name}</h4>
                                <p className="text-[10px] text-green-500">متصل الآن</p>
                              </div>
                            </>
                          )
                        })()}
                      </div>
                      <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[500px] custom-scrollbar">
                        {chatMessages.map((msg, idx) => (
                          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-[#FFD700] text-black font-bold' : 'bg-white/5 border border-white/10'}`}>
                              <p className="text-sm">{msg.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-6 border-t border-white/10">
                        <div className="relative flex gap-3">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="اكتب رسالتك هنا..."
                            className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]"
                          />
                          <button onClick={sendMessage} className="bg-[#FFD700] text-black px-6 py-4 rounded-2xl font-bold hover:scale-105 transition">
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 7: Portfolio Module */}
          {currentTab === 'portfolio' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#FFD700]">إدارة معرض الأعمال</h3>
                <button onClick={() => {
                  setNewPortfolio({})
                  setShowAddPortfolio(true)
                }} className="bg-[#FFD700] text-black px-6 py-3 rounded-2xl font-black flex items-center gap-3">
                  <Plus className="w-5 h-5" /> إضافة عمل
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {siteData.portfolio.map(item => (
                  <div key={item.id} className="bg-[#0F0F0F] border border-white/5 rounded-[2rem] overflow-hidden group">
                    <div className="h-40 relative">
                      <img src={item.image} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => {
                          setEditPortfolioForm(item)
                          setShowEditPortfolio(true)
                        }} className="w-10 h-10 bg-[#FFD700] text-black rounded-full flex items-center justify-center hover:scale-110 transition">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => {
                          const newPortfolio = siteData.portfolio.filter(p => p.id !== item.id)
                          saveSiteData({ ...siteData, portfolio: newPortfolio })
                        }} className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6 space-y-2">
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8: Partners Module */}
          {currentTab === 'partners' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#FFD700]">إدارة شركاء النجاح</h3>
                <button onClick={() => {
                  setNewPartner({})
                  setShowAddPartner(true)
                }} className="bg-[#FFD700] text-black px-6 py-3 rounded-2xl font-black flex items-center gap-3">
                  <Plus className="w-5 h-5" /> إضافة شريك
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {siteData.clients.map(partner => (
                  <div key={partner.id} className="bg-[#0F0F0F] border border-white/5 rounded-[2rem] p-6 flex flex-col items-center gap-4 group">
                    <div className="w-20 h-20 relative">
                      <img src={partner.logo} className="w-full h-full object-contain rounded-xl" />
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => {
                          setEditPartnerForm(partner)
                          setShowEditPartner(true)
                        }} className="w-8 h-8 bg-[#FFD700] text-black rounded-full flex items-center justify-center hover:scale-110 transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => {
                          const newClients = siteData.clients.filter(c => c.id !== partner.id)
                          saveSiteData({ ...siteData, clients: newClients })
                        }} className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-center text-xs font-bold">{partner.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-[3rem] max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 fade-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-white">إضافة عميل جديد</h3>
              <button onClick={() => setShowAddCustomer(false)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-6">
              <input placeholder="اسم العميل" value={newCustomer.name || ''} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]" />
              <input placeholder="رقم الهاتف" value={newCustomer.phone || ''} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]" />
              <textarea placeholder="تفاصيل الطلب" value={newCustomer.projectDetails || ''} onChange={(e) => setNewCustomer({ ...newCustomer, projectDetails: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700] min-h-[100px]" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="الإجمالي" value={newCustomer.totalAmount || ''} onChange={(e) => setNewCustomer({ ...newCustomer, totalAmount: Number(e.target.value) })} className="bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]" />
                <input type="number" placeholder="المدفوع" value={newCustomer.paidAmount || ''} onChange={(e) => setNewCustomer({ ...newCustomer, paidAmount: Number(e.target.value) })} className="bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]" />
              </div>
              <button onClick={addCustomer} className="w-full bg-[#FFD700] text-black py-4 rounded-2xl font-black text-lg hover:scale-105 transition">إضافة العميل</button>
            </div>
          </div>
        </div>
      )}

      {showAddSupplier && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-[3rem] max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 fade-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-white">إضافة مورّد جديد</h3>
              <button onClick={() => setShowAddSupplier(false)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-6">
              <input placeholder="اسم الشركة" value={newSupplier.companyName || ''} onChange={(e) => setNewSupplier({ ...newSupplier, companyName: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]" />
              <input placeholder="المسؤول" value={newSupplier.contactPerson || ''} onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]" />
              <input placeholder="رقم الهاتف" value={newSupplier.phone || ''} onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]" />
              <textarea placeholder="طلبنا منهم" value={newSupplier.orderDetails || ''} onChange={(e) => setNewSupplier({ ...newSupplier, orderDetails: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700] min-h-[100px]" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="الإجمالي" value={newSupplier.totalAmount || ''} onChange={(e) => setNewSupplier({ ...newSupplier, totalAmount: Number(e.target.value) })} className="bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]" />
                <input type="number" placeholder="المدفوع" value={newSupplier.paidAmount || ''} onChange={(e) => setNewSupplier({ ...newSupplier, paidAmount: Number(e.target.value) })} className="bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]" />
              </div>
              <button onClick={addSupplier} className="w-full bg-[#FFD700] text-black py-4 rounded-2xl font-black text-lg hover:scale-105 transition">إضافة المورّد</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditCustomer && editingCustomer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-[3rem] max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 fade-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-white">تعديل بيانات العميل</h3>
              <button onClick={() => setShowEditCustomer(false)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-6">
              <input placeholder="اسم العميل" value={editingCustomer.name || ''} onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]" />
              <input placeholder="رقم الهاتف" value={editingCustomer.phone || ''} onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]" />
              <textarea placeholder="تفاصيل الطلب" value={editingCustomer.projectDetails || ''} onChange={(e) => setEditingCustomer({ ...editingCustomer, projectDetails: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700] min-h-[100px]" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">الإجمالي</label>
                  <input type="number" placeholder="الإجمالي" value={editingCustomer.totalAmount || ''} onChange={(e) => setEditingCustomer({ ...editingCustomer, totalAmount: Number(e.target.value) })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">المدفوع</label>
                  <input type="number" placeholder="المدفوع" value={editingCustomer.paidAmount || ''} onChange={(e) => setEditingCustomer({ ...editingCustomer, paidAmount: Number(e.target.value) })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500">الحالة</label>
                <select value={editingCustomer.status} onChange={(e) => setEditingCustomer({ ...editingCustomer, status: e.target.value as any })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]">
                  <option value="pending">قيد المراجعة</option>
                  <option value="in_progress">جاري التنفيذ</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغى</option>
                </select>
              </div>
              <button onClick={() => updateCustomer(editingCustomer.id!, editingCustomer)} className="w-full bg-[#FFD700] text-black py-4 rounded-2xl font-black text-lg hover:scale-105 transition">حفظ التعديلات</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Supplier Modal */}
      {showEditSupplier && editingSupplier && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-[3rem] max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 fade-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-white">تعديل بيانات المورّد</h3>
              <button onClick={() => setShowEditSupplier(false)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-6">
              <input placeholder="اسم الشركة" value={editingSupplier.companyName || ''} onChange={(e) => setEditingSupplier({ ...editingSupplier, companyName: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]" />
              <input placeholder="المسؤول" value={editingSupplier.contactPerson || ''} onChange={(e) => setEditingSupplier({ ...editingSupplier, contactPerson: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]" />
              <input placeholder="رقم الهاتف" value={editingSupplier.phone || ''} onChange={(e) => setEditingSupplier({ ...editingSupplier, phone: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]" />
              <textarea placeholder="طلبنا منهم" value={editingSupplier.orderDetails || ''} onChange={(e) => setEditingSupplier({ ...editingSupplier, orderDetails: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700] min-h-[100px]" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">الإجمالي</label>
                  <input type="number" placeholder="الإجمالي" value={editingSupplier.totalAmount || ''} onChange={(e) => setEditingSupplier({ ...editingSupplier, totalAmount: Number(e.target.value) })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">المدفوع</label>
                  <input type="number" placeholder="المدفوع" value={editingSupplier.paidAmount || ''} onChange={(e) => setEditingSupplier({ ...editingSupplier, paidAmount: Number(e.target.value) })} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FFD700]" />
                </div>
              </div>
              <button onClick={() => updateSupplier(editingSupplier.id!, editingSupplier)} className="w-full bg-[#FFD700] text-black py-4 rounded-2xl font-black text-lg hover:scale-105 transition">حفظ التعديلات</button>
            </div>
          </div>
        </div>
      )}

      {showAddCategory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-[3rem] max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 fade-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-white flex items-center gap-3">
                <Tag className="text-[#FFD700]" />
                إضافة قسم جديد
              </h3>
              <button onClick={() => setShowAddCategory(false)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-400">اسم القسم</label>
                <input placeholder="مثال: لوحات إعلانية" value={newCategory.name || ''} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-400">صورة القسم</label>
                
                {newCategory.image && (
                  <div className="relative h-60 bg-black/40 rounded-3xl overflow-hidden border-2 border-white/10">
                    <img src={newCategory.image} className="w-full h-full object-cover" alt="Preview" />
                    <button onClick={() => setNewCategory({ ...newCategory, image: '' })} className="absolute top-4 left-4 w-10 h-10 bg-red-500/90 text-white rounded-full flex items-center justify-center hover:scale-110 transition">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
                
                <label className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-white/20 rounded-3xl cursor-pointer hover:border-[#FFD700] hover:bg-[#FFD700]/5 transition">
                  <Upload className="w-12 h-12 text-[#FFD700]" />
                  <span className="text-lg font-bold text-white">رفع صورة من جهازك</span>
                  <span className="text-xs text-gray-500">PNG, JPG, GIF حتى 10MB</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (img: string) => setNewCategory({ ...newCategory, image: img }))} />
                </label>
                
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
                    <ImageIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <input placeholder="أو اضع رابط الصورة هنا" value={newCategory.image || ''} onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 pr-16 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button onClick={() => {
                  if(!newCategory.name) return
                  const cat = { id: Date.now(), name: newCategory.name, image: newCategory.image || 'https://picsum.photos/400/300' }
                  saveSiteData({ ...siteData, categories: [...siteData.categories, cat] })
                  setShowAddCategory(false)
                  setNewCategory({})
                }} className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black py-6 rounded-3xl font-black text-xl shadow-xl hover:shadow-[#FFD700]/30 transition hover:scale-[1.02]">
                  إضافة القسم
                </button>
                <button onClick={() => { setShowAddCategory(false); setNewCategory({}) }} className="w-full bg-white/5 text-white py-5 rounded-3xl font-bold hover:bg-white/10 transition">
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditCategory && editCategoryForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-[3rem] max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 fade-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-white flex items-center gap-3">
                <Edit className="text-[#FFD700]" />
                تعديل القسم
              </h3>
              <button onClick={() => setShowEditCategory(false)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-400">اسم القسم</label>
                <input placeholder="مثال: لوحات إعلانية" value={editCategoryForm.name || ''} onChange={(e) => setEditCategoryForm({ ...editCategoryForm, name: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-400">صورة القسم</label>
                
                {editCategoryForm.image && (
                  <div className="relative h-60 bg-black/40 rounded-3xl overflow-hidden border-2 border-white/10">
                    <img src={editCategoryForm.image} className="w-full h-full object-cover" alt="Preview" />
                    <button onClick={() => setEditCategoryForm({ ...editCategoryForm, image: '' })} className="absolute top-4 left-4 w-10 h-10 bg-red-500/90 text-white rounded-full flex items-center justify-center hover:scale-110 transition">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
                
                <label className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-white/20 rounded-3xl cursor-pointer hover:border-[#FFD700] hover:bg-[#FFD700]/5 transition">
                  <Upload className="w-12 h-12 text-[#FFD700]" />
                  <span className="text-lg font-bold text-white">رفع صورة من جهازك</span>
                  <span className="text-xs text-gray-500">PNG, JPG, GIF حتى 10MB</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (img: string) => setEditCategoryForm({ ...editCategoryForm, image: img }))} />
                </label>
                
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
                    <ImageIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <input placeholder="أو اضع رابط الصورة هنا" value={editCategoryForm.image || ''} onChange={(e) => setEditCategoryForm({ ...editCategoryForm, image: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 pr-16 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button onClick={() => {
                  const newCats = siteData.categories.map(c => c.id === editCategoryForm.id ? editCategoryForm : c)
                  saveSiteData({ ...siteData, categories: newCats })
                  setShowEditCategory(false)
                  setEditCategoryForm(null)
                }} className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black py-6 rounded-3xl font-black text-xl shadow-xl hover:shadow-[#FFD700]/30 transition hover:scale-[1.02] flex items-center justify-center gap-3">
                  <Save className="w-6 h-6" />
                  حفظ التعديلات
                </button>
                <button onClick={() => { setShowEditCategory(false); setEditCategoryForm(null) }} className="w-full bg-white/5 text-white py-5 rounded-3xl font-bold hover:bg-white/10 transition">
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-[3rem] max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 fade-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-white flex items-center gap-3">
                <Package className="text-[#FFD700]" />
                إضافة منتج جديد
              </h3>
              <button onClick={() => setShowAddProduct(false)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400">اسم المنتج</label>
                  <input placeholder="مثال: لوحة اعلانية LED" value={newProduct.name || ''} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-400">السعر</label>
                    <input type="number" placeholder="0" value={newProduct.price || ''} onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-400">طريقة التسعير</label>
                    <select value={newProduct.pricingType || 'piece'} onChange={(e) => setNewProduct({ ...newProduct, pricingType: e.target.value as 'meter' | 'piece' | 'letter' })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition">
                      <option value="piece">القطعة</option>
                      <option value="meter">المتر</option>
                      <option value="letter">الحرف</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400">القسم</label>
                  <select value={newProduct.category || 'all'} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition">
                    <option value="all">اختر القسم</option>
                    {siteData.categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400">الأبعاد</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500">العرض</label>
                      <input type="number" placeholder="0" value={newProduct.width || ''} onChange={(e) => setNewProduct({ ...newProduct, width: Number(e.target.value) })} className="w-full bg-black/60 border-2 border-white/10 rounded-xl px-4 py-4 text-center text-white focus:outline-none focus:border-[#FFD700] transition" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500">الارتفاع</label>
                      <input type="number" placeholder="0" value={newProduct.height || ''} onChange={(e) => setNewProduct({ ...newProduct, height: Number(e.target.value) })} className="w-full bg-black/60 border-2 border-white/10 rounded-xl px-4 py-4 text-center text-white focus:outline-none focus:border-[#FFD700] transition" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500">الوحدة</label>
                      <select value={newProduct.unit || 'cm'} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value as 'm' | 'cm' })} className="w-full bg-black/60 border-2 border-white/10 rounded-xl px-4 py-4 text-center text-white focus:outline-none focus:border-[#FFD700] transition">
                        <option value="cm">سم</option>
                        <option value="m">متر</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400">وصف المنتج</label>
                  <textarea placeholder="اكتب وصفاً مفصلاً للمنتج..." value={newProduct.description || ''} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition min-h-[150px]" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-400">صورة المنتج</label>
                  
                  {newProduct.image && (
                    <div className="relative h-60 bg-black/40 rounded-3xl overflow-hidden border-2 border-white/10">
                      <img src={newProduct.image} className="w-full h-full object-cover" alt="Preview" />
                      <button onClick={() => setNewProduct({ ...newProduct, image: '' })} className="absolute top-4 left-4 w-10 h-10 bg-red-500/90 text-white rounded-full flex items-center justify-center hover:scale-110 transition">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  
                  <label className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-white/20 rounded-3xl cursor-pointer hover:border-[#FFD700] hover:bg-[#FFD700]/5 transition">
                    <Upload className="w-12 h-12 text-[#FFD700]" />
                    <span className="text-lg font-bold text-white">رفع صورة من جهازك</span>
                    <span className="text-xs text-gray-500">PNG, JPG, GIF حتى 10MB</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (img: string) => setNewProduct({ ...newProduct, image: img }))} />
                  </label>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
                      <ImageIcon className="w-5 h-5 text-gray-500" />
                    </div>
                    <input placeholder="أو اضع رابط الصورة هنا" value={newProduct.image || ''} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 pr-16 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
                  </div>
                </div>
                
                <div className="pt-6 space-y-4">
                  <button onClick={() => {
                    if(!newProduct.name) return
                    const prod = { id: Date.now(), ...newProduct, image: newProduct.image || 'https://picsum.photos/400/300' }
                    saveSiteData({ ...siteData, products: [...siteData.products, prod] })
                    setShowAddProduct(false)
                    setNewProduct({})
                  }} className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black py-6 rounded-3xl font-black text-xl shadow-xl hover:shadow-[#FFD700]/30 transition hover:scale-[1.02]">
                    إضافة المنتج
                  </button>
                  <button onClick={() => { setShowAddProduct(false); setNewProduct({}) }} className="w-full bg-white/5 text-white py-5 rounded-3xl font-bold hover:bg-white/10 transition">
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditProduct && editProductForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-[3rem] max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 fade-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-white flex items-center gap-3">
                <Edit className="text-[#FFD700]" />
                تعديل المنتج
              </h3>
              <button onClick={() => setShowEditProduct(false)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400">اسم المنتج</label>
                  <input placeholder="مثال: لوحة اعلانية LED" value={editProductForm.name || ''} onChange={(e) => setEditProductForm({ ...editProductForm, name: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-400">السعر</label>
                    <input type="number" placeholder="0" value={editProductForm.price || ''} onChange={(e) => setEditProductForm({ ...editProductForm, price: Number(e.target.value) })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-400">طريقة التسعير</label>
                    <select value={editProductForm.pricingType || 'piece'} onChange={(e) => setEditProductForm({ ...editProductForm, pricingType: e.target.value as 'meter' | 'piece' | 'letter' })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition">
                      <option value="piece">القطعة</option>
                      <option value="meter">المتر</option>
                      <option value="letter">الحرف</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400">القسم</label>
                  <select value={editProductForm.category || 'all'} onChange={(e) => setEditProductForm({ ...editProductForm, category: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition">
                    <option value="all">اختر القسم</option>
                    {siteData.categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400">الأبعاد</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500">العرض</label>
                      <input type="number" placeholder="0" value={editProductForm.width || ''} onChange={(e) => setEditProductForm({ ...editProductForm, width: Number(e.target.value) })} className="w-full bg-black/60 border-2 border-white/10 rounded-xl px-4 py-4 text-center text-white focus:outline-none focus:border-[#FFD700] transition" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500">الارتفاع</label>
                      <input type="number" placeholder="0" value={editProductForm.height || ''} onChange={(e) => setEditProductForm({ ...editProductForm, height: Number(e.target.value) })} className="w-full bg-black/60 border-2 border-white/10 rounded-xl px-4 py-4 text-center text-white focus:outline-none focus:border-[#FFD700] transition" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500">الوحدة</label>
                      <select value={editProductForm.unit || 'cm'} onChange={(e) => setEditProductForm({ ...editProductForm, unit: e.target.value as 'm' | 'cm' })} className="w-full bg-black/60 border-2 border-white/10 rounded-xl px-4 py-4 text-center text-white focus:outline-none focus:border-[#FFD700] transition">
                        <option value="cm">سم</option>
                        <option value="m">متر</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400">وصف المنتج</label>
                  <textarea placeholder="اكتب وصفاً مفصلاً للمنتج..." value={editProductForm.description || ''} onChange={(e) => setEditProductForm({ ...editProductForm, description: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition min-h-[150px]" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-400">صورة المنتج</label>
                  
                  {editProductForm.image && (
                    <div className="relative h-60 bg-black/40 rounded-3xl overflow-hidden border-2 border-white/10">
                      <img src={editProductForm.image} className="w-full h-full object-cover" alt="Preview" />
                      <button onClick={() => setEditProductForm({ ...editProductForm, image: '' })} className="absolute top-4 left-4 w-10 h-10 bg-red-500/90 text-white rounded-full flex items-center justify-center hover:scale-110 transition">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  
                  <label className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-white/20 rounded-3xl cursor-pointer hover:border-[#FFD700] hover:bg-[#FFD700]/5 transition">
                    <Upload className="w-12 h-12 text-[#FFD700]" />
                    <span className="text-lg font-bold text-white">رفع صورة من جهازك</span>
                    <span className="text-xs text-gray-500">PNG, JPG, GIF حتى 10MB</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (img: string) => setEditProductForm({ ...editProductForm, image: img }))} />
                  </label>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
                      <ImageIcon className="w-5 h-5 text-gray-500" />
                    </div>
                    <input placeholder="أو اضع رابط الصورة هنا" value={editProductForm.image || ''} onChange={(e) => setEditProductForm({ ...editProductForm, image: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 pr-16 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
                  </div>
                </div>
                
                <div className="pt-6 space-y-4">
                  <button onClick={() => {
                    const newProds = siteData.products.map(p => p.id === editProductForm.id ? editProductForm : p)
                    saveSiteData({ ...siteData, products: newProds })
                    setShowEditProduct(false)
                    setEditProductForm(null)
                  }} className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black py-6 rounded-3xl font-black text-xl shadow-xl hover:shadow-[#FFD700]/30 transition hover:scale-[1.02] flex items-center justify-center gap-3">
                    <Save className="w-6 h-6" />
                    حفظ التعديلات
                  </button>
                  <button onClick={() => { setShowEditProduct(false); setEditProductForm(null) }} className="w-full bg-white/5 text-white py-5 rounded-3xl font-bold hover:bg-white/10 transition">
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Portfolio Modal */}
      {showAddPortfolio && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-[3rem] max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 fade-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-white flex items-center gap-3">
                <Briefcase className="text-[#FFD700]" />
                إضافة عمل جديد
              </h3>
              <button onClick={() => setShowAddPortfolio(false)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-400">عنوان العمل</label>
                <input placeholder="مثال: تصميم شعار شركة..." value={newPortfolio.title || ''} onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-400">تصنيف العمل</label>
                <input placeholder="مثال: تصميم جرافيك، طباعة، اعلانات..." value={newPortfolio.category || ''} onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-400">وصف العمل</label>
                <textarea placeholder="اكتب وصفاً مفصلاً للعمل..." value={newPortfolio.description || ''} onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition min-h-[120px]" />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-400">صورة العمل</label>
                
                {newPortfolio.image && (
                  <div className="relative h-60 bg-black/40 rounded-3xl overflow-hidden border-2 border-white/10">
                    <img src={newPortfolio.image} className="w-full h-full object-cover" alt="Preview" />
                    <button onClick={() => setNewPortfolio({ ...newPortfolio, image: '' })} className="absolute top-4 left-4 w-10 h-10 bg-red-500/90 text-white rounded-full flex items-center justify-center hover:scale-110 transition">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
                
                <label className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-white/20 rounded-3xl cursor-pointer hover:border-[#FFD700] hover:bg-[#FFD700]/5 transition">
                  <Upload className="w-12 h-12 text-[#FFD700]" />
                  <span className="text-lg font-bold text-white">رفع صورة من جهازك</span>
                  <span className="text-xs text-gray-500">PNG, JPG, GIF حتى 10MB</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (img: string) => setNewPortfolio({ ...newPortfolio, image: img }))} />
                </label>
                
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
                    <ImageIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <input placeholder="أو اضع رابط الصورة هنا" value={newPortfolio.image || ''} onChange={(e) => setNewPortfolio({ ...newPortfolio, image: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 pr-16 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button onClick={() => {
                  if(!newPortfolio.title) return
                  const item = { id: Date.now(), title: newPortfolio.title, category: newPortfolio.category || 'تصميم', description: newPortfolio.description || '', image: newPortfolio.image || 'https://picsum.photos/400/300' }
                  saveSiteData({ ...siteData, portfolio: [...siteData.portfolio, item] })
                  setShowAddPortfolio(false)
                  setNewPortfolio({})
                }} className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black py-6 rounded-3xl font-black text-xl shadow-xl hover:shadow-[#FFD700]/30 transition hover:scale-[1.02]">
                  إضافة العمل
                </button>
                <button onClick={() => { setShowAddPortfolio(false); setNewPortfolio({}) }} className="w-full bg-white/5 text-white py-5 rounded-3xl font-bold hover:bg-white/10 transition">
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Portfolio Modal */}
      {showEditPortfolio && editPortfolioForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-[3rem] max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 fade-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-white flex items-center gap-3">
                <Edit className="text-[#FFD700]" />
                تعديل العمل
              </h3>
              <button onClick={() => setShowEditPortfolio(false)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-400">عنوان العمل</label>
                <input placeholder="مثال: تصميم شعار شركة..." value={editPortfolioForm.title || ''} onChange={(e) => setEditPortfolioForm({ ...editPortfolioForm, title: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-400">تصنيف العمل</label>
                <input placeholder="مثال: تصميم جرافيك، طباعة، اعلانات..." value={editPortfolioForm.category || ''} onChange={(e) => setEditPortfolioForm({ ...editPortfolioForm, category: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-400">وصف العمل</label>
                <textarea placeholder="اكتب وصفاً مفصلاً للعمل..." value={editPortfolioForm.description || ''} onChange={(e) => setEditPortfolioForm({ ...editPortfolioForm, description: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition min-h-[120px]" />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-400">صورة العمل</label>
                
                {editPortfolioForm.image && (
                  <div className="relative h-60 bg-black/40 rounded-3xl overflow-hidden border-2 border-white/10">
                    <img src={editPortfolioForm.image} className="w-full h-full object-cover" alt="Preview" />
                    <button onClick={() => setEditPortfolioForm({ ...editPortfolioForm, image: '' })} className="absolute top-4 left-4 w-10 h-10 bg-red-500/90 text-white rounded-full flex items-center justify-center hover:scale-110 transition">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
                
                <label className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-white/20 rounded-3xl cursor-pointer hover:border-[#FFD700] hover:bg-[#FFD700]/5 transition">
                  <Upload className="w-12 h-12 text-[#FFD700]" />
                  <span className="text-lg font-bold text-white">رفع صورة من جهازك</span>
                  <span className="text-xs text-gray-500">PNG, JPG, GIF حتى 10MB</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (img: string) => setEditPortfolioForm({ ...editPortfolioForm, image: img }))} />
                </label>
                
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
                    <ImageIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <input placeholder="أو اضع رابط الصورة هنا" value={editPortfolioForm.image || ''} onChange={(e) => setEditPortfolioForm({ ...editPortfolioForm, image: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 pr-16 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button onClick={() => {
                  const newPortfolio = siteData.portfolio.map(p => p.id === editPortfolioForm.id ? editPortfolioForm : p)
                  saveSiteData({ ...siteData, portfolio: newPortfolio })
                  setShowEditPortfolio(false)
                  setEditPortfolioForm(null)
                }} className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black py-6 rounded-3xl font-black text-xl shadow-xl hover:shadow-[#FFD700]/30 transition hover:scale-[1.02] flex items-center justify-center gap-3">
                  <Save className="w-6 h-6" />
                  حفظ التعديلات
                </button>
                <button onClick={() => { setShowEditPortfolio(false); setEditPortfolioForm(null) }} className="w-full bg-white/5 text-white py-5 rounded-3xl font-bold hover:bg-white/10 transition">
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Partner Modal */}
      {showAddPartner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-[3rem] max-w-xl w-full p-8 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 fade-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-white flex items-center gap-3">
                <Heart className="text-[#FFD700]" />
                إضافة شريك جديد
              </h3>
              <button onClick={() => setShowAddPartner(false)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-400">اسم الشريك</label>
                <input placeholder="مثال: شركة الندى..." value={newPartner.name || ''} onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-400">لوجو الشريك</label>
                
                {newPartner.logo && (
                  <div className="relative h-40 bg-black/40 rounded-3xl overflow-hidden border-2 border-white/10 flex items-center justify-center p-4">
                    <img src={newPartner.logo} className="max-h-full max-w-full object-contain" alt="Preview" />
                    <button onClick={() => setNewPartner({ ...newPartner, logo: '' })} className="absolute top-4 left-4 w-10 h-10 bg-red-500/90 text-white rounded-full flex items-center justify-center hover:scale-110 transition">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
                
                <label className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-white/20 rounded-3xl cursor-pointer hover:border-[#FFD700] hover:bg-[#FFD700]/5 transition">
                  <Upload className="w-12 h-12 text-[#FFD700]" />
                  <span className="text-lg font-bold text-white">رفع لوجو من جهازك</span>
                  <span className="text-xs text-gray-500">PNG, JPG, GIF حتى 10MB</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (img: string) => setNewPartner({ ...newPartner, logo: img }))} />
                </label>
                
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
                    <ImageIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <input placeholder="أو اضع رابط اللوجو هنا" value={newPartner.logo || ''} onChange={(e) => setNewPartner({ ...newPartner, logo: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 pr-16 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button onClick={() => {
                  if(!newPartner.name) return
                  const partner = { id: Date.now(), name: newPartner.name, logo: newPartner.logo || 'https://picsum.photos/200/200' }
                  saveSiteData({ ...siteData, clients: [...siteData.clients, partner] })
                  setShowAddPartner(false)
                  setNewPartner({})
                }} className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black py-6 rounded-3xl font-black text-xl shadow-xl hover:shadow-[#FFD700]/30 transition hover:scale-[1.02]">
                  إضافة الشريك
                </button>
                <button onClick={() => { setShowAddPartner(false); setNewPartner({}) }} className="w-full bg-white/5 text-white py-5 rounded-3xl font-bold hover:bg-white/10 transition">
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Partner Modal */}
      {showEditPartner && editPartnerForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-[3rem] max-w-xl w-full p-8 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 fade-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-white flex items-center gap-3">
                <Edit className="text-[#FFD700]" />
                تعديل الشريك
              </h3>
              <button onClick={() => setShowEditPartner(false)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-400">اسم الشريك</label>
                <input placeholder="مثال: شركة الندى..." value={editPartnerForm.name || ''} onChange={(e) => setEditPartnerForm({ ...editPartnerForm, name: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-400">لوجو الشريك</label>
                
                {editPartnerForm.logo && (
                  <div className="relative h-40 bg-black/40 rounded-3xl overflow-hidden border-2 border-white/10 flex items-center justify-center p-4">
                    <img src={editPartnerForm.logo} className="max-h-full max-w-full object-contain" alt="Preview" />
                    <button onClick={() => setEditPartnerForm({ ...editPartnerForm, logo: '' })} className="absolute top-4 left-4 w-10 h-10 bg-red-500/90 text-white rounded-full flex items-center justify-center hover:scale-110 transition">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
                
                <label className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-white/20 rounded-3xl cursor-pointer hover:border-[#FFD700] hover:bg-[#FFD700]/5 transition">
                  <Upload className="w-12 h-12 text-[#FFD700]" />
                  <span className="text-lg font-bold text-white">رفع لوجو من جهازك</span>
                  <span className="text-xs text-gray-500">PNG, JPG, GIF حتى 10MB</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (img: string) => setEditPartnerForm({ ...editPartnerForm, logo: img }))} />
                </label>
                
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
                    <ImageIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <input placeholder="أو اضع رابط اللوجو هنا" value={editPartnerForm.logo || ''} onChange={(e) => setEditPartnerForm({ ...editPartnerForm, logo: e.target.value })} className="w-full bg-black/60 border-2 border-white/10 rounded-2xl px-6 pr-16 py-5 text-lg text-white focus:outline-none focus:border-[#FFD700] transition" />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button onClick={() => {
                  const newClients = siteData.clients.map(c => c.id === editPartnerForm.id ? editPartnerForm : c)
                  saveSiteData({ ...siteData, clients: newClients })
                  setShowEditPartner(false)
                  setEditPartnerForm(null)
                }} className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black py-6 rounded-3xl font-black text-xl shadow-xl hover:shadow-[#FFD700]/30 transition hover:scale-[1.02] flex items-center justify-center gap-3">
                  <Save className="w-6 h-6" />
                  حفظ التعديلات
                </button>
                <button onClick={() => { setShowEditPartner(false); setEditPartnerForm(null) }} className="w-full bg-white/5 text-white py-5 rounded-3xl font-bold hover:bg-white/10 transition">
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #050505; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1A1A1A; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #FFD700; }
      `}</style>
    </div>
  )
}
