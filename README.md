# SAMBA Visualiser

![SAMBA Visualiser](./assets/samba.gif)

## Narrative

We collaborated with Tom Parkinson at the University of Sydney’s IEQ Lab to explore how low-cost sensors could improve building insight. His team developed SAMBA, which tracks ten indoor environmental variables. We used a year’s worth of five-minute sensor readings from a real multi-floor office in Sydney.

My goal was to design a landing page to help facilities managers and sustainability officers explore how indoor comfort and carbon intensity vary across space and time. The target audience also includes consultants and architects interested in how occupant experience intersects with environmental performance.

With an 800-word limit, the challenge was designing a scrollable interface that could sustain attention while unpacking complex data. I added dynamic controls for filtering by season, hour, and variable, enabling comparisons between floors and zones.

Monitoring shows that peak discomfort and energy use often coincide, yet most systems only track air temperature—a narrow metric that doesn’t capture the full spectrum of comfort. To challenge this, I developed a product demonstration to visualise SAMBA data—humidity, radiant temperature, airspeed, CO₂, noise, and lighting. A supplemental line chart helps highlight the misalignment between energy use and occupant comfort, comparing carbon intensity data (Electricity Maps, 2019) with Predicted Percentage Dissatisfied (PPD) scores across time.

To reinforce the need for a multi-variable approach, I also included a human-shaped bar chart showing how the body sheds heat—~60% via radiation, ~22% evaporation, ~15% conduction/convection ([Osilla et al., 2023](#references)). This underscores why comfort tracking must reflect sensory complexity. 

The landing page also situates comfort within the carbon context. One chart notes Australia’s G20-leading coal emissions ([Zieliński et al., 2022](#references)); another shows methane from coal mines may be underreported by 106% ([Wright et al., 2025](#references)). These charts reinforce the idea that buildings are both comfort systems and carbon systems.

[Inspired by schematic sci-fi interfaces](https://imgur.com/a/neon-genesis-evangelion-graphical-user-interface-gifs-PF3oA#6), the SAMBA visualiser includes a 3D surface plot that utilises colored mesh tiles for each zone, layered by floor. These act as 3D heatmaps, with color intensity reflecting variables like CO₂ or PPD, letting users intuitively compare conditions across the building.

I wrote a custom Python script to merge and preprocess SAMBA sensor data with hourly carbon intensity data from Electricity Maps. The script aligns timestamps, filters by season, and outputs a unified JSON file for use in the dashboard. Zones are grouped by floor, and the visualisation dynamically adjusts color scales based on the selected metric and its range.

```python
import pandas as pd
import json

# Load and process the data
df = pd.read_csv("all-floors.csv")
df['created_at'] = pd.to_datetime(df['created_at'])
df['date'] = df['created_at'].dt.date
df['hour'] = df['created_at'].dt.hour
df['datetime'] = pd.to_datetime(df['date'].astype(str)) + pd.to_timedelta(df['hour'], unit='h')

vars_of_interest = ['ta', 'tg', 'rh', 'a_s', 'spl', 'lux', 'co2', 'tmrt', 'pmv', 'ppd']
grouped = df.groupby(['floor_level', 'zone_id', 'datetime'])[vars_of_interest].mean().reset_index()

# Save as JSON
grouped.to_json("plotly_data.json", orient="records", date_format="iso")
```

Early feedback noted the interface felt visually rich but cognitively heavy, especially for locating problem areas. I redesigned the layout to show all zones per floor at once, with a flashing alert for the most suboptimal zone. Cluttered `<meter>` displays were replaced with grouped bar charts for better clarity and scalability.

While I developed all the code, I used ChatGPT to refactor and further modularise the JavaScript, improving performance and maintainability.

The final product is both analytical and evocative, enabling users to track indoor comfort and environmental impact across a spatially and temporally detailed model. It invites reflection on the sensory experience of occupants—while anchoring that experience within the broader systems that shape our climate future.


## Usability Testing

### Test Objectives

The primary goal was to evaluate whether users could:
- Understand the 3D surface plot and its representation of spatial data across floors and zones
- Interpret how environmental conditions varied throughout the building
- Use the interface to identify problematic areas, such as high discomfort or poor air quality

### Tasks Given to Users

Participants were asked to:
1. Determine the cause of high PPD at 3:00pm during summer
2. Identify the floor and time with the highest CO₂ concentration
3. Explain what the 3D surface plot shows for a specific hour and season

### Participants
The study included 10 participants: 5 interaction design students, 3 engineering students, and 2 professionals working in sustainability. All were new to the interface and had no prior exposure before testing.

### Key Findings

Participants generally grasped the purpose of the visualisation and responded well to the 3D surface plot. It was praised for making floor-by-floor comparisons intuitive, particularly when interpreting discomfort patterns like high PPD on upper levels during summer afternoons.

However, challenges emerged with the per-zone `<meter>` components. While users found them visually engaging, many struggled with comparing zone values across multiple floors. The small size and repetition led to scanning fatigue and made it difficult to spot extremes—especially for CO₂, where no overview of relative values was immediately visible. This issue contributed to confusion in Task 2.

Task 1 and Task 3 were successfully completed by most users. For Task 2, several users hesitated or misidentified the floor with the highest CO₂ due to the fragmented presentation of zone data. Users appreciated the time slider and season toggle but requested clearer legends or tooltips to clarify variable meanings and unit scales.

### Design Changes

In response, the individual zone meters were replaced with per-floor bar graphs, with each zone represented as a bar. This change enabled faster cross-zone comparisons within a floor and significantly reduced visual clutter. The graphs are now dynamically updated based on the selected variable and time, making the visualiser more scannable and responsive. Additionally, I added `<abbr>` tags to abbreviations with hoverable definitions to improve accessibility.

Follow-up informal testing showed improved task completion rates—particularly for identifying extreme values like CO₂ spikes. The new layout also scales better for buildings with many zones, allowing users to quickly scan patterns without losing spatial context.

## References
- CSIRO. (2023). *Sources of carbon dioxide emissions*. https://www.csiro.au/en/research/environmental-impacts/climate-change/climate-change-qa/sources-of-co2
- Electricity Maps. (n.d.). *New South Wales | Datasets | Electricity Maps*. Retrieved April 21, 2025, from https://portal.electricitymaps.com/datasets/AU-NSW
- Osilla, E. V., Marsidi, J. L., Shumway, K. R., & Sharma, S. (2023). Physiology, Temperature Regulation. *StatPearls*. https://www.ncbi.nlm.nih.gov/books/NBK507838/
- Parkinson, T., Parkinson, A., & de Dear, R. (2019). Continuous IEQ monitoring system: Performance specifications and thermal comfort classification. *Building and Environment*, 149, 241–252. https://doi.org/10.1016/j.buildenv.2018.12.016
- Parkinson, T., Schiavon, S., & de Dear, R. (2021). Overcooling of offices reveals gender inequity in thermal comfort. *Scientific Reports*, 11(1), 1–9. https://doi.org/10.1038/s41598-021-03121-1
- Wright, C., Setiawan, D., & Shannon, S. (2025). Satellite analysis identifies 40% more methane from Australian coal mines. *Ember*. https://ember-energy.org/latest-insights/satellite-analysis-identifies-more-methane-from-australian-coal-mines/
- Zieliński, M., Fletcher, J., Ewen, M., Fulghum, N., & Tunbridge, P. (2022). Global electricity review 2022. *Ember*. https://ember-energy.org/latest-insights/global-electricity-review-2022/