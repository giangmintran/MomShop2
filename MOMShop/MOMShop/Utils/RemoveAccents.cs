using System.Globalization;
using System.Text;

namespace MOMShop.Utils
{
    public class RemoveAccents
    {
        public static string RemoveAccent(string input)
        {
            string decomposed = input.Normalize(NormalizationForm.FormD);
            StringBuilder builder = new StringBuilder();

            foreach (char c in decomposed)
            {
                if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                {
                    builder.Append(c);
                }
            }

            return builder.ToString().Normalize(NormalizationForm.FormC);
        }
    }
}
