FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY NuGet.Config ./
COPY backend/LearningDashboard.sln ./
COPY backend/LearningDashboard.Api/LearningDashboard.Api.csproj LearningDashboard.Api/
COPY backend/LearningDashboard.Api.Tests/LearningDashboard.Api.Tests.csproj LearningDashboard.Api.Tests/

RUN dotnet restore LearningDashboard.sln

COPY backend/ ./
RUN dotnet publish LearningDashboard.Api/LearningDashboard.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .
RUN mkdir -p /app/Data

ENTRYPOINT ["dotnet", "LearningDashboard.Api.dll"]
