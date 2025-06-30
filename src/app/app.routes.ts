import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { AuthGuard } from './guards/admin-guard';
import { AdminGuard } from './guards/auth-guard';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Admin } from './components/admin/admin';
import { Books } from './services/book';
import { Profile } from './components/profile/profile';
import { BooksComponent } from './components/books/books';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard] 
  },
  { 
    path: 'books', 
    component: BooksComponent,
    canActivate: [AuthGuard] 
  },
  { 
    path: 'admin', 
    component: Admin,
    canActivate: [AuthGuard, AdminGuard] 
  },
  { 
    path: 'profile', 
    component: Profile,
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: 'login' }
];