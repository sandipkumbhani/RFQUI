using RFQ.UI.Application.Extension;
using RFQ.UI.Application.Inteface;
using RFQ.UI.Application.Provider;
using RFQ.UI.Domain.Interfaces;
using RFQ.UI.Domain.Model;
using RFQ.UI.Infrastructure.Extension;
using RFQ.UI.Infrastructure.Provider;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
var globalclass = new GlobalClass();
builder.Services.AddControllersWithViews();
builder.Services.AddEfcoreInfrastrucureService();
builder.Services.AddApplicationService();


builder.Services.AddHttpContextAccessor();
//builder.Services.AddSingleton(globalclass);
builder.Services.AddHttpClient();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
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

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Login}/{id?}");

app.Run();
