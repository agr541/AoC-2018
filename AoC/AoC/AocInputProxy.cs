internal class AocInputProxy
{

    public const string localAocSessionCookieName = "AOC_SESSION_ID";
    public const string remoteAocSessionCookieName = "session";
    private const string AOCFORMAT_YEAR_DAY = "https://adventofcode.com/{0}/day/{1}/input";

    internal static async Task GetInput(HttpContext context)
    {
        using var client = new HttpClient();
        SetAocSession(context, client);
        string aocUrl = GetAocInputUrl(context.Request.Headers.Referer);
        var input = await GetInputFromAoc(context, client, aocUrl);
        await context.Response.WriteAsync(input);
    }

    private static async Task<string> GetInputFromAoc(HttpContext context, HttpClient client, string aocUrl)
    {
        var input = "";
        try
        {
            input = await client.GetStringAsync(aocUrl);
        }
        catch(HttpRequestException ex)
        {
            if (ex.StatusCode == System.Net.HttpStatusCode.BadRequest)
            {
                context.Response.Cookies.Delete(localAocSessionCookieName);
            }
        }
        return input;
    }

    private static void SetAocSession(HttpContext context, HttpClient client)
    {
        var aocSessionId = GetAocSessionId(context);
        if (aocSessionId != null)
        {
            client.DefaultRequestHeaders.Add("Cookie", $"{remoteAocSessionCookieName}={aocSessionId}");
        }
    }

    private static string? GetAocSessionId(HttpContext context)
    {
        string? result = null;
        var sessionInCookie = context.Request.Cookies.ContainsKey(localAocSessionCookieName);

        result = sessionInCookie
        ? context.Request.Cookies[localAocSessionCookieName]
        : context.Request.Query["session"].SingleOrDefault();

        if (result != null)
        {
            context.Response.Cookies.Append(localAocSessionCookieName, result, new CookieOptions() { Expires = DateTimeOffset.Now.AddYears(3) });
        }

        return result;
    }

    private static string GetAocInputUrl(string referer)
    {
        var uri = new Uri(referer);
        var year = uri.Segments[1].TrimEnd('/');
        var day = uri.Segments[2].TrimEnd('/');
        var aocUrl = GetAocUrl(year, day);
        return aocUrl;
    }

    private static string GetAocUrl(string year, string day)
    {
        return string.Format(AOCFORMAT_YEAR_DAY, year, day);
    }
}
