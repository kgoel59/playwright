npx playwright test
npx playwright show-report

Test cases format = plot_(function_name).html
Test cases folder = test_cases/


Code for generating test_cases

```
import matplotlib.pyplot as plt
import mpld3
import mpld3.plugins as plugins
import numpy as np

# Generate data for a quadratic function y = x^2
x = np.arange(-10, 11)  # More points for a smoother curve
y = x ** 2

# Create the figure and axis
fig, ax = plt.subplots()

# Plot the quadratic function with markers
ax.plot(x, y, label='y = x^2', marker='o')  # Using markers to display points on the curve

# Set labels and title
ax.set_xlabel('X-axis')
ax.set_ylabel('Y-axis')
ax.set_title('Function: y = x^2')

# Add tooltips to the plot for each point
tooltips = [f'({x_val:.2f}, {y_val:.2f})' for x_val, y_val in zip(x, y)]
tooltip_plugin = plugins.PointLabelTooltip(ax.lines[0], labels=tooltips)
plugins.connect(fig, tooltip_plugin)

# Save the plot to an HTML file using mpld3
mpld3.save_html(fig, 'plot_(x^2).html')
```