using Newtonsoft.Json.Linq;
using RFQ.UI.Application.Extension;
using RFQ.UI.Domain.Model;
using RFQ.UI.Infrastructure.Extension;
using RFQ.UI.MapperProfile;
using Serilog;
using System.ComponentModel.Design;
using System.IdentityModel.Tokens.Jwt;



var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        builder => builder.WithOrigins("https://localhost:7265")
                          .WithOrigins("https://localhost:7075")
                          .WithOrigins("https://localhost:443")
                          .WithOrigins("https://192.168.0.72:443")
                          .WithOrigins("https://192.168.0.72:7075")
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials());
});


var globalclass = new GlobalClass();
// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddEfcoreInfrastrucureService();
builder.Services.AddApplicationService();
builder.Services.AddHttpContextAccessor();
builder.Services.AddHttpClient();
builder.Services.AddSingleton(globalclass);
builder.Services.AddAutoMapper(typeof(AutoMappersRegister));
builder.Services.AddSingleton(AppSettingsGlobal.FromConfiguration(builder.Configuration));
builder.Services.AddSession();
// Register CommonApiAdaptor for DI
builder.Services.AddScoped<RFQ.UI.Infrastructure.Provider.CommonApiAdaptor>();
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
            globalclass.jwtToken = new JwtSecurityTokenHandler().ReadJwtToken(token);
            globalclass.UserId = Convert.ToInt32(globalclass.jwtToken.Claims.First(c => c.Type == "userid").Value);
            globalclass.ProfileId = Convert.ToInt32(globalclass.jwtToken.Claims.First(c => c.Type == "profileid").Value);
            globalclass.CompanyId = Convert.ToInt32(globalclass.jwtToken.Claims.First(c => c.Type == "companyid").Value);
        };
        await next.Invoke();
    });
    // app.UseHttpsRedirection();
    app.UseStaticFiles();
    app.UseRouting();
    app.UseCors("AllowLocalhost");
    app.UseAuthorization();
    app.UseSession();
    app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Login}/{action=Login}/{id?}");

    app.Run();
}
finally
{
    Log.CloseAndFlush();
}