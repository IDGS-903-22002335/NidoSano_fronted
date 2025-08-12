import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import { ChangePassword } from './universal/change-password/change-password';
import { ForgotPassword } from './universal/forgot-password/forgot-password';
import { ResetPassword } from './universal/reset-password/reset-password';
import { Home } from './universal/home/home';
import { Users } from './administrator/users/users';
import { RoleComponent } from './universal/role-component/role-component';
import { Account } from './universal/account/account';
import { Login } from './universal/login/login';
import { Registro } from './administrator/registro/registro';
import { Dashboard } from './administrator/dashboard/dashboard';
import { RegisterClient } from './administrator/register-client/register-client';
import { RegisterAdministrator } from './administrator/register-administrator/register-administrator';
import { UpdateClient } from './administrator/update-client/update-client';
import { UserAdmin } from './administrator/user-admin/user-admin';
import { UpdateAdmin } from './administrator/update-admin/update-admin';
import { Message } from './administrator/message/message';
import { MessageDetail } from './administrator/message-detail/message-detail';
import { Supplier } from './administrator/supplier/supplier';
import { RegisterSupplier } from './administrator/register-supplier/register-supplier';
import { UpdateSupplier } from './administrator/update-supplier/update-supplier';
import { RawMaterial } from './administrator/raw-material/raw-material';
import { Buys } from './administrator/buys/buys';
import { Costing } from './administrator/costing/costing';
import { AdminProducts } from './administrator/admin-products/admin-products';
import { Production } from './administrator/production/production';
import { Updateproduction } from './administrator/updateproduction/updateproduction';
import { Sales } from './administrator/sales/sales';
import { SalesDetails } from './administrator/sales-details/sales-details';
import { BuysClient } from './universal/buys-client/buys-client';
import { BuysClientdetail } from './universal/buys-clientdetail/buys-clientdetail';
import { Estimate } from './universal/estimate/estimate';
import { ViewEstimate } from './universal/view-estimate/view-estimate';
import { View } from './universal/view/view';
import { ProductView } from './universal/product-view/product-view';
import { Questions } from './universal/questions/questions';
import { Footer } from './universal/footer/footer';
import { PossibleClient } from './administrator/possible-client/possible-client';
import { RegisterpossibleClient } from './administrator/registerpossible-client/registerpossible-client';
import { AboutUs } from './universal/about-us/about-us';
import { Nidosano } from './universal/nidosano/nidosano';
import { Guide } from './universal/guide/guide';
import { Manual } from './universal/manual/manual';


export const routes: Routes = [

  {
    path: '',
    component: View,
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard],
    data: {
      roles: ['Cliente '],   // solo permite que un Administrador entre
    },
  },
  {
    path: 'login',
    component: Login
  },

  {
    path: 'registro',
    component: Registro,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },
  },
  {
    path: 'registro_cliente',
    component: RegisterClient,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },

  },
  {
    path: 'registro_posiblecliente/:id',
    component: RegisterpossibleClient,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },

  },
  {
    path: 'proveedores',
    component: Supplier,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },

  },

  {
    path: 'registro_proveedor',
    component: RegisterSupplier,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },

  },
  {
    path: 'costeo',
    component: Costing,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },

  },
  {
    path: 'productos',
    component: AdminProducts,



  },
  {
    path: 'estatusproductos',
    component: Updateproduction,



  },
  {
    path: 'producción',
    component: Production,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },

  },
  {
    path: 'venta',
    component: Sales,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },

  },
  {
    path: 'venta_detalle/:id',
    component: SalesDetails,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },

  },
  {
    path: 'actualizacion_proveedor/:idSupplier',
    component: UpdateSupplier,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },

  },
  {
    path: 'compra',
    component: Buys,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },

  },
  {
    path: 'Inventario_Materia_Prima',
    component: RawMaterial,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },

  },
  {
    path: 'registro_administrador',
    component: RegisterAdministrator,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },
  },
  {
    path: 'ractualizar_cliente/:id',

    component: UpdateClient,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },
  },
  {
    path: 'ractualizar_admin/:id',

    component: UpdateAdmin,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },
  },
  {
    path: 'message',

    component: Message,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },
  },
  {
    path: 'message_detail/:id',

    component: MessageDetail,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },
  },
  {
    path: 'change-password',
    component: ChangePassword,
    canActivate: [authGuard],
  }, {
    path: 'account/:id',
    component: Account,
    canActivate: [authGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPassword,

  },
  {
    path: 'reset-password',
    component: ResetPassword,

  },
  {
    path: 'users',
    component: Users,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },
  },
  {
    path: 'users_Admin',
    component: UserAdmin,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },
  },
  {
    path: 'roles',
    component: RoleComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },

  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un Administrador entre
    },

  },

  {
    path: 'compra_cliente',
    component: BuysClient,
    canActivate: [roleGuard],
    data: {
      roles: ['Cliente'],   // solo permite que un cliente entre
    },

  },
  {
    path: 'compra_cliente_detalle/:saleId',
    component: BuysClientdetail,
    canActivate: [roleGuard],
    data: {
      roles: ['Cliente'],   // solo permite que un cliente entre
    },

  },
  {
    path: 'estimateCliente',
    component: Estimate,
    canActivate: [roleGuard],
    data: {
      roles: ['Cliente'],   // solo permite que un cliente entre
    },

  },
  {
    path: 'guide',
    component: Guide,
    canActivate: [roleGuard],
    data:{
      roles: ['Cliente'],
    }
  },
  {
    path: 'manual',
    component: Manual,
    canActivate: [roleGuard],
    data: {
      roles: ['Cliente'],
    }
  },
  {
    path: 'posible_cliente',
    component: PossibleClient,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],   // solo permite que un cliente entre
    },

  },

  {
    path: 'estimate',
    component: ViewEstimate,


  },
  {
    path: 'Product_view',
    component: ProductView,
  },
  {
    path: 'Preguntas_respuestas',
    component: Questions,
  },
  {
    path: 'about_us',
    component: AboutUs
  },
  {
    path: 'nidosano',
    component: Nidosano
  }

];
