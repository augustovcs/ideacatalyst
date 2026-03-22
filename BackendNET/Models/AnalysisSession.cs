using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
//a
namespace Models
{
    [Table("analysis_sessions")]
    public class AnalysisSession : BaseModel
    {
        [PrimaryKey("id", false)]
        public Guid Id { get; set; }

        [Column("idea")]
        public string? Idea { get; set; }

        [Column("status")]
        public string? Status { get; set; }

    
    }
}