import app from '../src/app';
const routes: string[] = [];
(app as any)._router?.stack.forEach((r: any) => {
  if (r.route && r.route.path) {
    const methods = Object.keys(r.route.methods).join(',');
    routes.push(`${methods.toUpperCase()} ${r.route.path}`);
  }
});
console.log(routes.join('\n'));