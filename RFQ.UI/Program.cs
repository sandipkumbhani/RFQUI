using RFQ.UI.Application.Extension;
using RFQ.UI.Domain.Model;
using RFQ.UI.Infrastructure.Extension;
using RFQ.UI.MapperProfile;
using Serilog;



var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();

var globalclass = new GlobalClass();
// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddEfcoreInfrastrucureService();
builder.Services.AddApplicationService();
builder.Services.AddHttpContextAccessor();
builder.Services.AddHttpClient();
builder.Services.AddSingleton(globalclass);
builder.Services.AddAutoMapper(typeof(AutoMappersRegister));
try
{
    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (!app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
        app.UseExceptionHandler("/Home/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }


    app.Use(async (context, next) =>
    {
        // Read a specific cookie
        var token = context.Request.Cookies["AuthToken"];

        if (token != null)
        {
            globalclass.Token = token;
        }
        await next.Invoke();
    });

   // app.UseHttpsRedirection();
    app.UseStaticFiles();

    app.UseRouting();

    app.UseAuthorization();

    app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Login}/{action=Login}/{id?}");

    app.Run();
}
finally
{
    Log.CloseAndFlush();
}