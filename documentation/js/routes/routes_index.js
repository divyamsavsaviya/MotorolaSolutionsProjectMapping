var ROUTES_INDEX = {"name":"<root>","kind":"module","className":"AppModule","children":[{"name":"routes","filename":"src/app/app-routing.module.ts","module":"AppRoutingModule","children":[{"path":"","redirectTo":"/login","pathMatch":"full"},{"path":"login","component":"LoginComponent"},{"path":"dashBoard","component":"DashBoardComponent","canActivate":["AuthGuard"],"children":[{"path":"userManagement","component":"UserManagementComponent","canActivate":["RoleGuard"]},{"path":"projectManagement","component":"ProjectManagementComponent"}]}],"kind":"module"}]}
