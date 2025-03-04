import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getToken']); // Mock do AuthService
    routerMock = jasmine.createSpyObj('Router', ['navigate']); // Mock do Router

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(AuthGuard); // Injeta o AuthGuard
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation when token exists', () => {
    authServiceMock.getToken.and.returnValue('valid-token'); // Simula usuário autenticado

    const result = guard.canActivate();

    expect(result).toBeTrue(); // Deve permitir acesso
    expect(routerMock.navigate).not.toHaveBeenCalled(); // Não deve redirecionar
  });

  it('should deny activation and redirect to login when token is missing', () => {
    authServiceMock.getToken.and.returnValue(null); // Simula usuário não autenticado

    const result = guard.canActivate();

    expect(result).toBeFalse(); // Deve negar acesso
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']); // Deve redirecionar para o login
  });
});
