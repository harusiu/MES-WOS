import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

const Colors = () => import('@/views/theme/Colors')
const Typography = () => import('@/views/theme/Typography')

const Charts = () => import('@/views/charts/Charts')
const Widgets = () => import('@/views/widgets/Widgets')

// Views - Components
const Cards = () => import('@/views/base/Cards')
const Forms = () => import('@/views/base/Forms')
const Switches = () => import('@/views/base/Switches')
const Tables = () => import('@/views/base/Tables')
const Tabs = () => import('@/views/base/Tabs')
const Breadcrumbs = () => import('@/views/base/Breadcrumbs')
const Carousels = () => import('@/views/base/Carousels')
const Collapses = () => import('@/views/base/Collapses')
const Jumbotrons = () => import('@/views/base/Jumbotrons')
const ListGroups = () => import('@/views/base/ListGroups')
const Navs = () => import('@/views/base/Navs')
const Navbars = () => import('@/views/base/Navbars')
const Paginations = () => import('@/views/base/Paginations')
const Popovers = () => import('@/views/base/Popovers')
const ProgressBars = () => import('@/views/base/ProgressBars')
const Tooltips = () => import('@/views/base/Tooltips')

// Views - Buttons
const StandardButtons = () => import('@/views/buttons/StandardButtons')
const ButtonGroups = () => import('@/views/buttons/ButtonGroups')
const Dropdowns = () => import('@/views/buttons/Dropdowns')
const BrandButtons = () => import('@/views/buttons/BrandButtons')

// Views - Icons
const CoreUIIcons = () => import('@/views/icons/CoreUIIcons')
const Brands = () => import('@/views/icons/Brands')
const Flags = () => import('@/views/icons/Flags')

// Views - Notifications
const Alerts = () => import('@/views/notifications/Alerts')
const Badges = () => import('@/views/notifications/Badges')
const Modals = () => import('@/views/notifications/Modals')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')

// Users
const Users = () => import('@/views/users/Users')
const User = () => import('@/views/users/User')



// MES, manufacturing order
const ManOrder = () => import('@/views/mes/order/ManOrder')
// MES, product
const ProductSpec = () => import('@/views/mes/product/ProductSpec')
const ProductProcess = () => import('@/views/mes/product/ProductProcess')
// MES, work order
const WoAll = () => import('@/views/mes/workorder/WoAll')
const WoExecutable = () => import('@/views/mes/workorder/WoExecutable')
// MES, schedule
//const SchJobs = () => import('@/views/mes/schedule/SchJobs')
//const SchOrder = () => import('@/views/mes/schedule/SchOrder')
//const SchSettingRun = () => import('@/views/mes/schedule/SchSettingRun')
const SchResultSC = () => import('@/views/mes/schedule/SchResultSC')
const SchResult = () => import('@/views/mes/schedule/SchResult')
const SchResultGantt = () => import('@/views/mes/schedule/SchResultGantt')
const SchResultTimeline = () => import('@/views/mes/schedule/SchResultTimeline')
const SchResultDaySpan = () => import('@/views/mes/schedule/SchResultDaySpan')
const SchProgress = () => import('@/views/mes/schedule/SchProgress')
// MES, jobreport
//const JobProgress = () => import('@/views/mes/jobreport/JobProgress')
//const QrCode = () => import('@/views/mes/jobreport/QrCode')
//const QrReader = () => import('@/views/pages/QrReader')
//const JobReport = () => import('@/views/pages/JobReport')
// MES, equipment
//const EquipList = () => import('@/views/mes/equipment/EquipList')
// MES, test
//const Test = () => import('@/views/mes/test/Test')
// MES, inventory (from Siu)
//const InventoryList = () => import('@/views/mes/inandout/InventoryList')
//const LogList = () => import('@/views/mes/inandout/LogList')
//const StockInAndOut = () => import('@/views/mes/inandout/StockInAndOut')



Vue.use(Router)

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
  return [
    {
      path: '/',
      //redirect: '/dashboard',
      redirect: '/order/manorder',
      name: 'Home',
      component: TheContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'theme',
          redirect: '/theme/colors',
          name: 'Theme',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'colors',
              name: 'Colors',
              component: Colors
            },
            {
              path: 'typography',
              name: 'Typography',
              component: Typography
            }
          ]
        },
        {
          path: 'charts',
          name: 'Charts',
          component: Charts
        },
        {
          path: 'widgets',
          name: 'Widgets',
          component: Widgets
        },
        {
          path: 'users',
          meta: { label: 'Users'},
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: Users,
            },
            {
              path: ':id',
              meta: { label: 'User Details'},
              name: 'User',
              component: User,
            },
          ]
        },
        {
          path: 'base',
          redirect: '/base/cards',
          name: 'Base',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'cards',
              name: 'Cards',
              component: Cards
            },
            {
              path: 'forms',
              name: 'Forms',
              component: Forms
            },
            {
              path: 'switches',
              name: 'Switches',
              component: Switches
            },
            {
              path: 'tables',
              name: 'Tables',
              component: Tables
            },
            {
              path: 'tabs',
              name: 'Tabs',
              component: Tabs
            },
            {
              path: 'breadcrumbs',
              name: 'Breadcrumbs',
              component: Breadcrumbs
            },
            {
              path: 'carousels',
              name: 'Carousels',
              component: Carousels
            },
            {
              path: 'collapses',
              name: 'Collapses',
              component: Collapses
            },
            {
              path: 'jumbotrons',
              name: 'Jumbotrons',
              component: Jumbotrons
            },
            {
              path: 'list-groups',
              name: 'List Groups',
              component: ListGroups
            },
            {
              path: 'navs',
              name: 'Navs',
              component: Navs
            },
            {
              path: 'navbars',
              name: 'Navbars',
              component: Navbars
            },
            {
              path: 'paginations',
              name: 'Paginations',
              component: Paginations
            },
            {
              path: 'popovers',
              name: 'Popovers',
              component: Popovers
            },
            {
              path: 'progress-bars',
              name: 'Progress Bars',
              component: ProgressBars
            },
            {
              path: 'tooltips',
              name: 'Tooltips',
              component: Tooltips
            }
          ]
        },
        {
          path: 'buttons',
          redirect: '/buttons/standard-buttons',
          name: 'Buttons',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'standard-buttons',
              name: 'Standard Buttons',
              component: StandardButtons
            },
            {
              path: 'button-groups',
              name: 'Button Groups',
              component: ButtonGroups
            },
            {
              path: 'dropdowns',
              name: 'Dropdowns',
              component: Dropdowns
            },
            {
              path: 'brand-buttons',
              name: 'Brand Buttons',
              component: BrandButtons
            }
          ]
        },
        {
          path: 'icons',
          redirect: '/icons/coreui-icons',
          name: 'CoreUI Icons',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'coreui-icons',
              name: 'Icons library',
              component: CoreUIIcons
            },
            {
              path: 'brands',
              name: 'Brands',
              component: Brands
            },
            {
              path: 'flags',
              name: 'Flags',
              component: Flags
            }
          ]
        },
        {
          path: 'notifications',
          redirect: '/notifications/alerts',
          name: 'Notifications',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'alerts',
              name: 'Alerts',
              component: Alerts
            },
            {
              path: 'badges',
              name: 'Badges',
              component: Badges
            },
            {
              path: 'modals',
              name: 'Modals',
              component: Modals
            }
          ]
        }
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'register',
          name: 'Register',
          component: Register
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
      ]
    },
    {
      path: '/order',
      redirect: '/order/manorder',
      name: '製令',
      component: TheContainer,
      children: [
        {
          path: 'manorder',
          name: '製令總覽',
          component: ManOrder
        },
      ]
    },
    {
      path: '/product',
      redirect: '/product/productspec',
      name: '產品',
      component: TheContainer,
      children: [
        {
          path: 'productspec',
          name: '產品規格',
          component: ProductSpec
        },
        {
          path: 'productprocess',
          name: '產品製程',
          component: ProductProcess
        },
      ]
    },
    {
      path: '/workorder',
      redirect: '/workorder/woall',
      name: '工單',
      component: TheContainer,
      children: [
        {
          path: 'woall',
          name: '工單總覽',
          component: WoAll
        },
        {
          path: 'woexecutable',
          name: '可執行工單',
          component: WoExecutable
        },
      ]
    },
    {
      path: '/schedule',
      redirect: '/schedule/schresult',
      name: '排程',
      component: TheContainer,
      children: [
        /*{
          path: 'schjobs',
          name: '工單',
          component: SchJobs
        },
        {
          path: 'schsettingrun',
          name: '設定、執行',
          component: SchSettingRun
        },*/
        {
          path: 'schresultsc',
          name: '結果 (Table)',
          component: SchResultSC
        },
        {
          path: 'schresult',
          name: '結果 (Fortop)',
          component: SchResult
        },
        {
          path: 'schresultgantt',
          name: '結果 (Gantt)',
          component: SchResultGantt
        },
        {
          path: 'schresulttimeline',
          name: '結果 (Timeline)',
          component: SchResultTimeline
        },
        {
          path: 'schresultdayspan',
          name: '結果 (Calendar)',
          component: SchResultDaySpan
        },
        {
          path: 'schprogress',
          name: '生產進度',
          component: SchProgress
        }
      ]
    },
  ]
}
