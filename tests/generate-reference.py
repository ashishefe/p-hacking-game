"""Regenerate offline fixtures with SciPy 1.17.0 (not a runtime dependency)."""
import json
import numpy as np
from scipy import stats
f = [{'f':f, 'df1':a, 'df2':b, 'p':float(stats.f.sf(f,a,b))} for a,b in [(1,1),(1,198),(4,4),(5,30),(10,189)] for f in [0.00000001,0.000001,0.1,1,3,10,100]]
t = [{'t':t,'df':df,'p':float(2*stats.t.sf(abs(t),df))} for df in [1,2,3.5,10,198] for t in [0,0.00001,0.5,1,2,5,10]]
a,b = [1,2,4,8], [2,3,5,6,7]
w = stats.ttest_ind(a,b,equal_var=False)
v = stats.f_oneway(a,b)
x,y = [1,2,3,4,5,6], [2,1,4,3,7,5]
r = stats.linregress(x,y)
X = np.column_stack([np.ones(8), np.arange(1,9), [1,0,2,1,3,2,0,4]])
Y = np.array([2,1,4,3,7,5,6,9])
beta = np.linalg.lstsq(X,Y,rcond=None)[0]
sse = np.sum((Y-X@beta)**2)
sst = np.sum((Y-Y.mean())**2)
multi = {'x1':X[:,1].tolist(),'x2':X[:,2].tolist(),'y':Y.tolist(),'p':float(stats.f.sf(((sst-sse)/2)/(sse/5),2,5))}
with open('tests/statistics-reference.json','w') as out:
 json.dump({'source':'SciPy 1.17.0 scipy.stats f.sf, t.sf, ttest_ind, f_oneway, linregress', 'f':f,'t':t,'welch':{'statistic':float(w.statistic),'p':float(w.pvalue)},'anova':{'statistic':float(v.statistic),'p':float(v.pvalue)},'multiple_regression':multi,'regression':{'x':x,'y':y,'p':float(r.pvalue)}},out,indent=2)
