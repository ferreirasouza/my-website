using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(estudo.Startup))]
namespace estudo
{
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);
        }
    }
}
