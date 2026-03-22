using Supabase;
using System;
using System.Threading.Tasks;
using Models;

namespace TestingClasses
{
    public class DatabaseTestService
    {
        private readonly Supabase.Client _supabaseClient;

        public DatabaseTestService(Supabase.Client supabaseClient)
        {
            _supabaseClient = supabaseClient;
        }

        public async Task TestInsertAsync()
        {
            var data = new AnalysisSession
            {
                Idea = "Beijar a evelyn",
                Status = "Tomara que aconteca"
            };


/*          TESTE CONSOLE!! DAAAAAMNN

            Console.WriteLine("O que voce quer?");
            var response2 = Console.ReadLine();

            Console.WriteLine("Quando? ");
            var response3 = Console.ReadLine();

            var data2 = new AnalysisSession
            {
                Idea = response2,
                Status =  response3
            };
 */
            var response = await _supabaseClient
                .From<AnalysisSession>()
                .Insert(data);

            Console.WriteLine("Inserido com sucesso");
        }
    }
}