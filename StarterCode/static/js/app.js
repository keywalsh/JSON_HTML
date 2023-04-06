// Use D3 library to read in samples.json from url
// Create variable for url 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
      console.log(data);
});

// Create function for drop down
function init() {
    // Grab a reference to the dropdown select element
    let selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json(url).then((data) => {
      let sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      let firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json(url).then((data) => {
      let metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      let panel = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      panel.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);
      });
  
    });
  }
  
  // Create the buildCharts function.
  function buildCharts(sample) {
    // Use d3.json to load and retrieve the samples.json file 
    d3.json(url).then((data) => {
      // Create a variable that holds the samples array. 
      let samplesArray = data.samples;
      console.log(samplesArray)
  
      // Create a variable that filters the samples for the object with the desired sample number.
      let filtered = samplesArray.filter(sampleObj => sampleObj.id == sample);
      console.log(filtered)
  
      // Create a variable that filters the metadata array for the object with the desired sample number.
      let metadata = data.metadata;
      let sampleFilter = metadata.filter(sampleObj => sampleObj.id == sample);
  
      // Create a variable that holds the first sample in the metadata array.
      let result = sampleFilter[0];
  
      // Create a variable that holds the first sample in the array.
      let theSelection = filtered[0]
      console.log(theSelection)
  
      // Create variables that hold the otu_ids, otu_labels, and sample_values.
      let ids = theSelection.otu_ids
      let labels = theSelection.otu_labels
      let values = theSelection.sample_values
      console.log(ids)
      console.log(labels)
      console.log(values)
  
  
      // Create the y ticks for the bar chart.
      let yticks = ids.slice(0,10).map(ids => `OTU ${ids}`).reverse();
      console.log(yticks);
  
      // Create the trace for the bar chart. 
      let barData = [{
        x: values.slice(0,10).reverse(),
        y: yticks,
        text: labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
      }];
  
      // Create the layout for the bar chart. 
      let barLayout = {
        title : "Top 10 Bacteria Cultures Found"
      };
      // Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);
      
      // Create the trace for the bubble chart.
      let bubbleData = [{
        x: ids ,
        y: values ,
        text: labels,
        mode: "markers",
        marker: {
          size: values,
          color: ids,
        }
      }];
  
      // Create the layout for the bubble chart.
      let bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title:"OTU ID"},
      };
  
      // Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    });
  }