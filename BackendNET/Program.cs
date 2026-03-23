using Supabase;
using Microsoft.OpenApi;
using TestingClasses;
using Interfaces;
using Services;

var AllowSpecificOrigins = "innertiaWeb";
var builder = WebApplication.CreateBuilder(args);

// CORS

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowSpecificOrigins, policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:8080")
            .AllowAnyHeader()
            .AllowAnyMethod();
            //.AllowCredentials();
    });
});

// Swagger
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

// Supabase
builder.Services.AddScoped<Supabase.Client>(_ =>
    new Supabase.Client(
        builder.Configuration["SupabaseUrl"] ?? throw new ArgumentNullException("SupabaseUrl is not configured"),
        builder.Configuration["SupabaseKey"],
        new SupabaseOptions
        {
            AutoRefreshToken = true,
            AutoConnectRealtime = true,
        }
    )
);

builder.Services.AddControllers();

//SERVICES SCOPE
builder.Services.AddScoped<IIdeaInput, IdeaInput>();
builder.Services.AddScoped<IGetOutput, GetOutput>();


var app = builder.Build();

using var scope = app.Services.CreateScope();
var supabaseClient = scope.ServiceProvider.GetRequiredService<Supabase.Client>();
await supabaseClient.InitializeAsync();

// Teste
var dbTestService = new TestingClasses.DatabaseTestService(supabaseClient);
await dbTestService.TestInsertAsync();


app.UseRouting();
app.UseCors(AllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Swagger UI
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

//app.UseHttpsRedirection();
app.MapStaticAssets();
await app.RunAsync();