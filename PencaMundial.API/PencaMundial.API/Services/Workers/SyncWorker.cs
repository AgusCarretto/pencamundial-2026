using PencaMundial.API.Services;

namespace PencaMundial.API.Workers
{
    public class SyncWorker : BackgroundService
    {
        private readonly ILogger<SyncWorker> _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly TimeSpan _interval = TimeSpan.FromMinutes(10); // Intervalo de 10 min

        public SyncWorker(ILogger<SyncWorker> logger, IServiceScopeFactory scopeFactory)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Worker de Sincronización iniciado.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("Iniciando sincronización automática: {time}", DateTimeOffset.Now);

                    // Creamos un scope manual para resolver servicios Scoped
                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var syncService = scope.ServiceProvider.GetRequiredService<SyncService>();
                        var result = await syncService.SyncMatchesAsync();
                        _logger.LogInformation("Resultado del Worker: {result}", result);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error en el ciclo de sincronización.");
                }

                // Esperamos 10 minutos antes de la próxima ejecución
                await Task.Delay(_interval, stoppingToken);
            }
        }
    }
}