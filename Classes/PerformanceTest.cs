using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MathNet.Numerics;

namespace Test_Blazor_WebAssembly_StatisticsAndML_DotNet5
{
    public class PerformanceTest
    {
        string fullName = string.Empty;

        public int ID { get; set; }

        public string DistributionName { get; set; }

        public int TrialsNumber { get; set; }

        public int SamplesNumber { get; set; }

        public double TestDuration { get; set; }

        public double TakeSamples()
        {
            var dateTimeElapsed = 0.0;
            var dateTime = DateTime.Now;

            if (this.DistributionName == "Binomial")
            {
                fullName = $"{DistributionName}-Samples:{SamplesNumber}-Trials:{TrialsNumber}";

                var binomaial = new MathNet.Numerics.Distributions.Binomial(0.5, this.TrialsNumber);
                var generatedsamples = binomaial.Samples().Take(SamplesNumber).ToArray();
            }
            else if (this.DistributionName == "Geometric")
            {
                fullName = $"{DistributionName}-Samples:{SamplesNumber}";

                var geometric = new MathNet.Numerics.Distributions.Geometric(0.5);
                var generatedsamples = geometric.Samples().Take(SamplesNumber).ToArray();
            }
            else if (this.DistributionName == "Poisson")
            {
                fullName = $"{DistributionName}-Samples:{SamplesNumber}";

                var poisson = new MathNet.Numerics.Distributions.Poisson(0.5);
                var generatedsamples = poisson.Samples().Take(SamplesNumber).ToArray();
            }
            else if (this.DistributionName == "Normal")
            {
                fullName = $"{DistributionName}-Samples:{SamplesNumber}";

                var normal = new MathNet.Numerics.Distributions.Normal(0.5, 2);
                var generatedsamples = normal.Samples().Take(SamplesNumber).ToArray();
            }

            dateTimeElapsed = (DateTime.Now - dateTime).TotalMilliseconds;
            return dateTimeElapsed;
        }

        public string GetTestName()
        {
            return fullName;
        }
    }
}
