<?php
// In bootstrap/app.php, inside ->withMiddleware(function (Middleware $middleware) { ... })
// register the role middleware alias so 'role:super_admin' works in routes:

// ->withMiddleware(function (Middleware $middleware) {
//     $middleware->alias([
//         'role' => \App\Http\Middleware\EnsureUserHasRole::class,
//     ]);
// })
