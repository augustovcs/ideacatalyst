using Supabase;
using Microsoft.OpenApi;
using TestingClasses;
using Interfaces;
using Services;
using Classes;

var AllowSpecificOrigins = "innertiaWeb";
var builder = WebApplication.CreateBuilder(args);

// =========================
// CORS
// =========================
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowSpecificOrigins, policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:8080")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// =========================
// Swagger
// =========================
builder.Services.AddAuthorization();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v0.1",
        Title = "Trending Analysis API Official",
        Description = "Be careful with our endpoints! ass: Augusto"
    });
});

// =========================
// Supabase (CORRETO)
// =========================
builder.Services.AddScoped<Supabase.Client>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();

    var client = new Supabase.Client(
        config["SupabaseUrl"] ?? throw new ArgumentNullException("SupabaseUrl"),
        config["SupabaseKey"] ?? throw new ArgumentNullException("SupabaseKey"),
        new SupabaseOptions
        {
            AutoRefreshToken = true,
            AutoConnectRealtime = true,
        }
    );

    // 🔥 ESSENCIAL: inicializa no próprio ciclo do DI
    client.InitializeAsync().Wait();

    return client;
});

// =========================
// Controllers
// =========================
builder.Services.AddControllers();

// =========================
// Services
// =========================
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IHistoryService, HistoryService>();
builder.Services.AddScoped<IIdeaInput, IdeaInput>();
builder.Services.AddScoped<IGetOutput, GetOutput>();

builder.Services.AddSingleton<AIConn>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    return new AIConn(configuration);
});

// =========================
// BUILD
// =========================
var app = builder.Build();

// ❌ REMOVIDO:
// - CreateScope
// - InitializeAsync manual
// - TestInsert fora do fluxo

// =========================
// Middleware
// =========================
app.UseRouting();
app.UseCors(AllowSpecificOrigins);

//app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// =========================
// Swagger UI
// =========================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.DocumentTitle = "Innertia Official API 1.2";
        c.EnableFilter();
        c.DisplayRequestDuration();
    });
}

// app.UseHttpsRedirection();

//app.MapStaticAssets();

await app.RunAsync();